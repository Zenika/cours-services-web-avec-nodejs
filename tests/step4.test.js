/* eslint-env mocha */

const utils = require('./test-utils');

const expect = utils.expect;

describe('app server at step 4', () => {
  let server;

  before('waiting for the server to give its port', (done) => {
    utils.startServer((server_) => {
      server = server_;
      done();
    }, done);
  });

  after((done) => {
    server.stop(done);
  });

  it('outputs its port on startup', () => {
    // this test just nicely confirms that the before hook executed OK
  });

  describe('GET /health', () => {
    let response;

    before((done) => {
      server.hit('get', '/health', (healthResponse) => {
        response = healthResponse;
        done();
      }, done);
    });

    it('responds 200 OK', () => {
      expect(response.statusCode).to.equal(200);
    });
  });

  describe('GET /contacts', () => {
    let response;

    before((done) => {
      server.hit('get', '/contacts', (getAllResponse) => {
        response = getAllResponse;
        done();
      }, done);
    });

    it('responds 200 OK', () => {
      expect(response.statusCode).to.equal(200);
    });

    it('returns some contacts', () => {
      expect(response.body).to.be.an('Array');
      expect(response.body).to.all.contain.keys('id', 'firstName', 'lastName');
    });
  });

  describe('GET /contacts/:id', () => {
    describe('with an existing id', () => {
      let response;
      let expectedContact;

      before((done) => {
        server.hit('get', '/contacts', (getAllResponse) => {
          expectedContact = getAllResponse.body[0];
          server.hit('get', `/contacts/${expectedContact.id}`, (getOneResponse) => {
            response = getOneResponse;
            done();
          }, done);
        }, done);
      });

      it('responds 200 OK', () => {
        expect(response.statusCode).to.equal(200);
      });

      it('returns one contact', () => {
        expect(response.body).to.be.an('object');
        expect(response.body).to.contain.keys('id', 'firstName', 'lastName');
      });

      it('returns the right contact', () => {
        expect(response.body).to.deep.equal(expectedContact);
      });
    });

    describe('with an absent id', () => {
      let response;

      before((done) => {
        server.hit('get', '/contacts/absent_id', (getOneResponse) => {
          response = getOneResponse;
          done();
        }, done);
      });

      it('responds 404 Not Found', () => {
        expect(response.statusCode).to.equal(404);
      });
    });
  });

  describe('POST /contacts', () => {
    const newContact = { firstName: 'Clark', lastName: 'Kent' };
    let response;

    before((done) => {
      server.hit('post', '/contacts', newContact, (response_) => {
        response = response_;
        done();
      }, done);
    });

    it('responds 201 Created', () => {
      expect(response.statusCode).to.equal(201);
    });

    it('returns the location of the new contact', () => {
      expect(response.body).to.match(/^\/contacts\/[^/]+$/);
    });

    it('returns a location header containing the location of the new contact', () => {
      expect(response.headers.location).to.match(/^\/contacts\/[^/]+$/);
    });

    it('ensures the new contact is at the returned location', (done) => {
      console.log(response.body);
      server.hit('get', response.body, (getNewContactResponse) => {
        expect(getNewContactResponse.body).to.be.an('object');
        expect(getNewContactResponse.body).to.include(newContact);
        done();
      }, done);
    });
  });

  describe('DELETE /contacts/:id', () => {
    let response;
    let targetContact;

    before((done) => {
      server.hit('get', '/contacts', (getAllResponse) => {
        targetContact = getAllResponse.body[0];
        server.hit('delete', `/contacts/${targetContact.id}`, (deleteResponse) => {
          response = deleteResponse;
          done();
        }, done);
      }, done);
    });

    it('responds 204 No Content', () => {
      expect(response.statusCode).to.equal(204);
    });

    it('returns an empty body', () => {
      expect(response.body).to.equal('');
    });

    it('responds 404 Not Found on subsequent calls', (done) => {
      server.hit('delete', `/contacts/${targetContact.id}`, (deleteAgainResponse) => {
        expect(deleteAgainResponse.statusCode).to.equal(404);
        done();
      }, done);
    });
  });
});
