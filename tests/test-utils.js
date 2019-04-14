const _ = require('lodash');
const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');
const request = require('request');
const chai = require('chai');
const chaiThings = require('chai-things');
const pkg = require('../package.json');

const contactFile = path.resolve(process.env.npm_package_config_contacts);

function lines(stdout) {
  return stdout
    .toString()
    .split('\n')
    .filter(line => Boolean(line))
    .filter(line => !line.startsWith('>'));
}

function runApp(args, success, failure) {
  childProcess.exec(`npm start ${args}`, { timeout: 10000 }, (err, stdout) => {
    if (err) return failure(err);
    return success(lines(stdout));
  });
}

function findPort(stdout) {
  return _(lines(stdout))
    .map(line => line.match(/^port: (\d+)/))
    .compact()
    .map(match => match[1])
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

function readContacts(success, failure) {
  fs.readFile(contactFile, (err, content) => {
    if (err) return failure(err);
    return success(JSON.parse(content));
  });
}

function writeContacts(contacts, callback) {
  fs.writeFile(contactFile, JSON.stringify(contacts, null, 2), callback);
}

function difference(contactsAfter, contactsBefore) {
  const contactsByIdBefore = _.keyBy(contactsBefore, 'id');
  const contactsByIdAfter = _.keyBy(contactsAfter, 'id');
  const diff = { added: [], removed: [] };
  _.each(contactsByIdBefore, (contact, id) => {
    if (!contactsByIdAfter[id]) diff.removed.push(contact);
  });
  _.each(contactsByIdAfter, (contact, id) => {
    if (!contactsByIdBefore[id]) diff.added.push(contact);
  });
  return diff;
}

function diffContactsBeforeAndAfter(args, success, failure) {
  readContacts((contactsBefore) => {
    runApp(
      args,
      () => {
        readContacts((contactsAfter) => {
          success(
            difference(contactsAfter, contactsBefore),
            contactsBefore,
            contactsAfter,
            (callback) => {
              writeContacts(contactsBefore, callback);
            },
          );
        }, failure);
      },
      failure,
    );
  }, failure);
}

function startServer(startServerSuccess, startServerFailure) {
  startServerSuccess = _.once(startServerSuccess); // eslint-disable-line no-param-reassign
  readContacts((contactsBefore) => {
    function serverInstance(serverProcess, port) {
      function hit(method, uriPath, postData, hitSuccess, hitFailure) {
        if (_.isFunction(postData)) {
          // if postData is omitted
          /* eslint-disable no-param-reassign */
          hitFailure = hitSuccess;
          hitSuccess = postData;
          postData = null;
          /* eslint-disable no-param-reassign */
        }
        request(
          {
            method,
            url: `http://127.0.0.1:${port}${uriPath}`,
            body: postData,
            json: Boolean(postData),
          },
          (err, response, body) => {
            if (err) {
              hitFailure(err);
            } else {
              response.body = tryParseAsJson(body);
              hitSuccess(response);
            }
          },
        );
      }

      function stop(callback) {
        serverProcess.kill();
        writeContacts(contactsBefore, callback);
      }

      return {
        hit,
        stop,
      };
    }

    const serverProcess = childProcess.spawn('node', [pkg.main, 'serve']);

    serverProcess.stderr.on('data', (stderr) => {
      console.error('server error:', stderr.toString());
    });

    serverProcess.stdout.on('data', (stdout) => {
      const port = findPort(stdout);
      if (!port) return;
      startServerSuccess(serverInstance(serverProcess, port));
    });
  }, startServerFailure);
}

module.exports = {
  contactFile,
  expect: chai.use(chaiThings).expect,
  runApp,
  startServer,
  diffContactsBeforeAndAfter,
};
