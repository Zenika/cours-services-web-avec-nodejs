/* eslint-env mocha */
"use strict";

const nock = require("nock");
const utils = require("./test-utils");
const expect = utils.expect;
const express = require("express")


describe("app at step 5", function () {

  describe("add", function () {

    it("calls POST /contacts", function (done) {
      let called = false
      const server = express().post("/contacts", function (req, res) {
        console.log("express that")
        called = true
        res.status(200).end()
      }).listen(3232, function () {
        console.error("WOWO")
        utils.runApp("-- --http add Clark Kent", function (a) {
          console.error("LOL", a)
          expect(called).to.equal(true);
          server.close()
          done();
        }, err => {throw err});
        // expect(called).to.equal(true);
        // done();
      })
      // const addRequest = nock("http://127.0.0.1:3232")
      //   .post("/contacts")
      //   .reply(201, "/contacts/newId");
      // process.argv = [process.argv[0], "./app.js", "--http", "add", "Clark", "Kent"]
      // require("../app")
      // setTimeout(function () {
      //   expect(addRequest.isDone()).to.equal(true);
      //   done()
      // }, 10000)
      // utils.runApp("-- --http add Clark Kent", function () {
      //   expect(addRequest.isDone()).to.equal(true);
      //   done();
      // }, err => {throw err});
    });

  });

  describe("remove <id>", function () {

    it("calls DELETE /contacts/<id>", function (done) {
      const id = "id"
      let called = false
      express().delete("/contacts/id", function (req, res) {
        console.log("express that")
        called = true
        res.status(200).end()
      }).listen(3232, function () {
        console.error("WOWO")
        utils.runApp("-- --http remove id", function () {
          console.error("LOL")
          expect(called).to.equal(true);
          done();
        }, err => {throw err});
      })
    });

  });

});