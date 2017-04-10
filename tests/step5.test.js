/* eslint-env mocha */

const express = require('express');
const utils = require('./test-utils');

const expect = utils.expect;


describe('app at step 5', () => {
  describe('add', () => {
    it('calls POST /contacts', (done) => {
      let called = false;
      const server = express().post('/contacts', (req, res) => {
        called = true;
        res.status(200).end();
      }).listen(3232, () => {
        utils.runApp('-- --http add Clark Kent', () => {
          server.close();
          expect(called).to.equal(true);
          done();
        }, (err) => { throw err; });
      });
    });
  });

  describe('remove <id>', () => {
    it('calls DELETE /contacts/<id>', (done) => {
      let called = false;
      const server = express().delete('/contacts/id', (req, res) => {
        called = true;
        res.status(200).end();
      }).listen(3232, () => {
        utils.runApp('-- --http remove id', () => {
          server.close();
          expect(called).to.equal(true);
          done();
        }, (err) => { throw err; });
      });
    });
  });
});
