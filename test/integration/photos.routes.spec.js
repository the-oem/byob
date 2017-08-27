/* global describe */
/* global it */
/* global beforeEach */
/* global afterEach */

process.env.NODE_ENV = 'test';
const chai = require('chai');

const should = chai.should();
const chaiHttp = require('chai-http');

const knex = require('../../src/server/knex');
const server = require('../../src/server/server.js');

chai.use(chaiHttp);

describe('Testing Photos API Routes', () => {
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

  afterEach((done) => {
    knex.migrate.rollback()
      .then(() => {
        done();
      });
  });

  describe('GET /api/v1/photos', () => {
    it('should respond with all photos', (done) => {
      chai.request(server)
        .get('/api/v1/photos')
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.status.should.eql('success');
          res.body.data[0].should.include.keys(
            'location_id', 'camera_id', 'id', 'url',
            'name', 'description', 'aperture_value', 'iso', 'exposure_mode',
            'shutter_speed', 'content_creation_date', 'gps', 'acquisition_model',
            'acquisition_make', 'fnumber', 'focal_length', 'lens_make', 'lens_model');
          done();
        });
    });
  });

  describe('GET /api/v1/photos/:id', () => {
    it('should respond with a single photo with id 1', (done) => {
      chai.request(server)
        .get('/api/v1/photos/1')
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.status.should.eql('success');
          res.body.data[0].should.include.keys(
            'location_id', 'camera_id', 'id', 'url',
            'name', 'description', 'aperture_value', 'iso', 'exposure_mode',
            'shutter_speed', 'content_creation_date', 'gps', 'acquisition_model',
            'acquisition_make', 'fnumber', 'focal_length', 'lens_make', 'lens_model');
          done();
        });
    });

    it('should respond with a 404 error if photo is not found.', (done) => {
      chai.request(server)
        .get('/api/v1/photos/2000')
        .end((err, res) => {
          should.exist(err);
          res.status.should.equal(404);
          res.type.should.equal('application/json');
          res.body.status.should.equal('error');
          res.body.data.error.should.equal('Photo with id (2000) was not found.');
          done();
        });
    });
  });
});