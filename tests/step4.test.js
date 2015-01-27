/* eslint-env mocha */
"use strict";

const utils = require("./test-utils");
const expect = utils.expect;

describe("app server at step 4", function () {

  let server;

  before("waiting for the server to give its port", function (done) {
    utils.startServer(function (server_) {
      server = server_;
      done();
    }, done);
  });

  after(function (done) {
    server.stop(done);
  });

  it("outputs its port on startup", function () {
    // this test just nicely confirms that the before hook executed OK
  });

  describe("GET /health", function () {

    let response;

    before(function (done) {
      server.hit("get", "/health", function (healthResponse) {
        response = healthResponse;
        done();
      }, done);
    });

    it("responds 200 OK", function () {
      expect(response.statusCode).to.equal(200);
    });

  });

  describe("GET /contacts", function () {

    let response;

    before(function (done) {
      server.hit("get", "/contacts", function (getAllResponse) {
        response = getAllResponse;
        done();
      }, done);
    });

    it("responds 200 OK", function () {
      expect(response.statusCode).to.equal(200);
    });

    it("returns some contacts", function () {
      expect(response.body).to.be.an("Array");
      expect(response.body).to.all.contain.keys("id", "firstName", "lastName");
    });

  });

  describe("GET /contacts/:id", function () {

    describe("with an existing id", function () {

      let response, expectedContact;

      before(function (done) {
        server.hit("get", "/contacts", function (getAllResponse) {
          expectedContact = getAllResponse.body[0];
          server.hit("get", `/contacts/${expectedContact.id}`, function (getOneResponse) {
            response = getOneResponse;
            done();
          }, done);
        }, done);
      });

      it("responds 200 OK", function () {
        expect(response.statusCode).to.equal(200);
      });

      it("returns one contact", function () {
        expect(response.body).to.be.an("object");
        expect(response.body).to.contain.keys("id", "firstName", "lastName");
      });

      it("returns the right contact", function () {
        expect(response.body).to.deep.equal(expectedContact);
      });

    });

    describe("with an absent id", function () {

      let response;

      before(function (done) {
        server.hit("get", `/contacts/absent_id`, function (getOneResponse) {
          response = getOneResponse;
          done();
        }, done);
      });

      it("responds 404 Not Found", function () {
        expect(response.statusCode).to.equal(404);
      });

    });

  });

  describe("POST /contacts", function () {

    let newContact = {firstName: "Clark", lastName: "Kent"};
    let response;

    before(function (done) {
      server.hit("post", "/contacts", newContact, function (response_) {
        response = response_;
        done();
      }, done);
    });

    it("responds 201 Created", function () {
      expect(response.statusCode).to.equal(201);
    });

    it("returns the location of the new contact", function () {
      expect(response.body).to.match(/^\/contacts\/[^\/]+$/);
    });

    it("returns a location header containing the location of the new contact", function () {
      expect(response.headers.location).to.match(/^\/contacts\/[^\/]+$/);
    });

    it("ensures the new contact is at the returned location", function (done) {
      server.hit("get", response.body, function (getNewContactResponse) {
        expect(getNewContactResponse.body).to.be.an("object");
        expect(getNewContactResponse.body).to.include(newContact);
        done();
      }, done);
    });

  });

  describe("DELETE /contacts/:id", function () {

    let response, targetContact;

    before(function (done) {
      server.hit("get", "/contacts", function (getAllResponse) {
        targetContact = getAllResponse.body[0];
        server.hit("delete", `/contacts/${targetContact.id}`, function (deleteResponse) {
          response = deleteResponse;
          done();
        }, done);
      }, done);
    });

    it("responds 204 No Content", function () {
      expect(response.statusCode).to.equal(204);
    });

    it("returns an empty body", function () {
      expect(response.body).to.equal("");
    });

    it("responds 404 Not Found on subsequent calls", function (done) {
      server.hit("delete", `/contacts/${targetContact.id}`, function (deleteAgainResponse) {
        expect(deleteAgainResponse.statusCode).to.equal(404);
        done();
      }, done);
    });

  });

});
