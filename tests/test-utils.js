"use strict";

const _ = require("lodash");
const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");
const request = require("request");
const contactFile = path.resolve(process.env.npm_package_config_contacts);
const pkg = require("../package.json");

module.exports = {
  contactFile: contactFile,
  expect: require("chai").use(require("chai-things")).expect,
  runApp: runApp,
  startServer: startServer,
  diffContactsBeforeAndAfter: diffContactsBeforeAndAfter,
};

function runApp(args, success, failure) {
  childProcess.exec("npm start " + args, {timeout: 10000}, function (err, stdout) {
    if (err) return failure(err);
    success(lines(stdout));
  });
}

function startServer(success, failure) {
  success = _.once(success); // ensure it's called only once
  readContacts(function (contactsBefore) {
    let serverProcess = childProcess.spawn("node", [pkg.main, "serve"]);

    serverProcess.stderr.on("data", function onStderrData(stderr) {
      console.error("server error:", stderr.toString())
    });

    serverProcess.stdout.on("data", function onStdoutData(stdout) {
      let port = findPort(stdout);
      if (!port) return;
      success(serverInstance(serverProcess, port));
    });

    function serverInstance(serverProcess, port) {
      return {
        hit: hit,
        stop: stop,
      };

      function hit(method, path, postData, success, failure) {
        if (_.isFunction(postData)) { // if postData is omitted
          failure = success;
          success = postData;
          postData = null;
        }
        request(
          {
            method: method,
            url: `http://127.0.0.1:${port}${path}`,
            body: postData,
            json: Boolean(postData)
          },
          function (err, response, body) {
            if (err) return failure(err);
            response.body = tryParseAsJson(body);
            success(response);
          }
        );
      }

      function stop(callback) {
        serverProcess.kill();
        writeContacts(contactsBefore, callback)
      }
    }
  }, failure);

}

function lines(stdout) {
  return stdout.toString()
    .split("\n")
    .filter(function notEmpty(line) {
      return Boolean(line);
    })
    .filter(function notNpm(line) {
      return !line.startsWith(">");
    });
}

function findPort(stdout) {
  return _(lines(stdout))
    .map(function (line) {
      return line.match(/^port: (\d+)/);
    })
    .compact()
    .map(function (match) {
      return match[1];
    })
    .compact()
    .first();
}

function tryParseAsJson(body) {
  try {
    return JSON.parse(body);
  } catch (err) {
    return body;
  }
}

function diffContactsBeforeAndAfter(args, success, failure) {
  readContacts(function (contactsBefore) {
    runApp(args, function () {
      readContacts(function (contactsAfter) {
        success(difference(contactsAfter, contactsBefore), contactsBefore, contactsAfter, function restore(callback) {
          writeContacts(contactsBefore, callback);
        });
      }, failure);
    }, failure);
  }, failure);
}

function readContacts(success, failure) {
  fs.readFile(contactFile, function (err, content) {
    if (err) return failure(err);
    success(JSON.parse(content));
  });
}

function writeContacts(contacts, callback) {
  fs.writeFile(contactFile, JSON.stringify(contacts, null, 2), callback);
}

function difference(contactsAfter, contactsBefore) {
  const contactsByIdBefore = _.keyBy(contactsBefore, "id");
  const contactsByIdAfter = _.keyBy(contactsAfter, "id");
  const diff = {added: [], removed: []};
  _.each(contactsByIdBefore, function (contact, id) {
    if (!contactsByIdAfter[id]) diff.removed.push(contact);
  });
  _.each(contactsByIdAfter, function (contact, id) {
    if (!contactsByIdBefore[id]) diff.added.push(contact);
  });
  return diff;
}
