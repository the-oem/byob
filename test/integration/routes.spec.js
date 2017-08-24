/* global describe */
/* global it */
/* global beforeEach */

process.env.NODE_ENV = 'test';
const chai = require('chai');

const should = chai.should();
const chaiHttp = require('chai-http');

const knex = require('../../src/server/knex');
const server = require('../../src/server/server.js');

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should send text to home page', (done) => {
    chai.request(server)
      .get('/')
      .end((err, response) => {
        should.not.exist(err);
        response.should.have.status(200);
        done();
      });
  });
});

describe('Testing API Routes', () => {
  beforeEach((done) => {
    knex.migrate.rollback()
      .then(() => {
        knex.migrate.latest()
          .then(() => {
            knex.seed.run()
              .then(() => {
                done();
              });
          });
      });
  });

  it('should send text to home page', (done) => {
    chai.request(server)
      .get('/')
      .end((err, response) => {
        response.should.have.status(200);
        done();
      });
  });
});
