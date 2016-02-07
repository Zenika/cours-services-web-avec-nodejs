"use strict";

const bodyParser = require("body-parser");
const commander = require("commander");
const express = require("express");

function withRepository(f) {
  return function () {
    return f(selectRepository(), ...arguments);
  };

  function selectRepository() {
    if (commander.memory) return require("./contact-memory-repository");
    if (commander.http) return require("./contact-http-repository");
    return require("./contact-file-repository");
  }
}

commander.option("--memory")
commander.option("--http")

commander.command("list")
  .description("prints all contacts to stdout")
  .action(withRepository(function (repository) {
    repository.getAll(function (err, contacts) {
      if (err) throw err;
      contacts.forEach(function (contact) {
        console.log(contact.lastName.toUpperCase(), contact.firstName);
      });
    });
  }));

commander.command("add <firstName> <lastName>")
  .description("add a contact")
  .action(withRepository(function (repository, firstName, lastName) {
    repository.add({firstName: firstName, lastName: lastName}, function (err) {
      if (err) throw err;
    });
  }));

commander.command("remove <id>")
  .description("remove a contact")
  .action(withRepository(function (repository, id) {
    repository.remove(id, function (err) {
      if (err) throw err;
    });
  }));

commander.command("serve")
  .description("start a server")
  .action(function () {
    let app = express();
    app.use(bodyParser.json());

    app.get("/health", function (req, res) {
      res.sendStatus(200);
    });

    app.route("/contacts")
      .get(function (req, res) {
        contactRepository.getAll(function (err, contacts) {
          if (err) return res.sendStatus(500);
          res.json(contacts);
        });
      })
      .post(function (req, res) {
        contactRepository.add(req.body, function (err, newId) {
          if (err) return res.sendStatus(500);
          let newContactLocation = `/contacts/${newId}`;
          res.status(201).location(newContactLocation).send(newContactLocation);
        });
      });

    app.route("/contacts/:id")
      .get(function (req, res) {
        contactRepository.get(req.params.id, function (err, contact) {
          if (err) return res.sendStatus(500);
          if (!contact) return res.sendStatus(404);
          res.json(contact);
        });
      })
      .delete(function (req, res) {
        contactRepository.remove(req.params.id, function (err, wasFound) {
          if (err) return res.sendStatus(500);
          if (!wasFound) return res.sendStatus(404);
          res.sendStatus(204);
        });
      });

    let server = app.listen(process.env.npm_package_config_port, function () {
      console.log("port:", server.address().port);
    });
  });

commander.parse(process.argv);

if (process.argv.length < 3) commander.help();
