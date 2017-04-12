/* eslint-env mocha */

const bodyParser = require('body-parser');
const express = require('express');
const utils = require('./test-utils');

const expect = utils.expect;


describe('app at step 5', () => {
  describe('add', () => {
    it('calls POST /contacts', (done) => {
      const expectedContact = { firstName: 'Clark', lastName: 'Kent' };
      let called = false;
      const server = express()
        .use(bodyParser.json())
        .post('/contacts', (req, res) => {
          called = true;
          expect(req.body).to.eql(expectedContact);
          res.status(200).end();
        })
        .listen(3232, () => {
          utils.runApp(
            `-- --http add ${expectedContact.firstName} ${expectedContact.lastName}`,
            () => {
              server.close();
              expect(called).to.equal(true);
              done();
            },
            (err) => { throw err; });
        });
    });
  });

  describe('remove <id>', () => {
    it('calls DELETE /contacts/<id>', (done) => {
      const expectedId = 'id';
      let called = false;
      const server = express()
        .delete(`/contacts/${expectedId}`, (req, res) => {
          called = true;
          res.status(200).end();
        })
        .listen(3232, () => {
          utils.runApp(`-- --http remove ${expectedId}`, () => {
            server.close();
            expect(called).to.equal(true);
            done();
          }, (err) => { throw err; });
        });
    });
  });
});
