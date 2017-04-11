const bodyParser = require('body-parser');
const commander = require('commander');
const express = require('express');
const serveStatic = require('serve-static')
const contactMemoryRepository = require('./contact-memory-repository');
const contactHttpRepository = require('./contact-http-repository');
const contactFileRepository = require('./contact-file-repository');

function withRepository(f) {
  function selectRepository() {
    if (commander.memory) return contactMemoryRepository;
    if (commander.http) return contactHttpRepository;
    return contactFileRepository;
  }

  return (...args) => f(selectRepository(), ...args);
}

commander.option('--memory');
commander.option('--http');

commander.command('list')
  .description('prints all contacts to stdout')
  .action(withRepository((repository) => {
    repository.getAll((err, contacts) => {
      if (err) throw err;
      contacts.forEach((contact) => {
        console.log(contact.lastName.toUpperCase(), contact.firstName);
      });
    });
  }));

commander.command('add <firstName> <lastName>')
  .description('add a contact')
  .action(withRepository((repository, firstName, lastName) => {
    repository.add({ firstName, lastName }, (err) => {
      if (err) throw err;
    });
  }));

commander.command('remove <id>')
  .description('remove a contact')
  .action(withRepository((repository, id) => {
    repository.remove(id, (err) => {
      if (err) throw err;
    });
  }));

commander.command('serve')
  .description('start a server')
  .action(withRepository((repository) => {
    const app = express();
    app
      .use(bodyParser.json())
      .use(serveStatic('./public'));

    app.get('/health', (req, res) => {
      res.sendStatus(200);
    });

    app.route('/contacts')
      .get((req, res) => {
        repository.getAll((err, contacts) => {
          if (err) res.sendStatus(500);
          else res.json(contacts);
        });
      })
      .post((req, res) => {
        repository.add(req.body, (err, newId) => {
          if (err) {
            res.sendStatus(500);
          } else {
            const newContactLocation = `/contacts/${newId}`;
            res.status(201).location(newContactLocation).send(newContactLocation);
          }
        });
      });

    app.route('/contacts/:id')
      .get((req, res) => {
        repository.get(req.params.id, (err, contact) => {
          if (err) res.sendStatus(500);
          else if (!contact) res.sendStatus(404);
          else res.json(contact);
        });
      })
      .delete((req, res) => {
        repository.remove(req.params.id, (err, wasFound) => {
          if (err) res.sendStatus(500);
          else if (!wasFound) res.sendStatus(404);
          else res.sendStatus(204);
        });
      });

    const server = app.listen(process.env.npm_package_config_port, () => {
      console.log('port:', server.address().port);
    });
  }));

commander.parse(process.argv);

if (process.argv.length < 3) commander.help();
