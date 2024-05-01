const request = require('supertest');
const { app } = require('../app');

let expect;

describe('GET /api/tipo-via', () => {
  before(async () => {
    expect = (await import('chai')).expect;
  });

  it('responde con un JSON con la lista de tipos de vía', (done) => {
    request(app)
      .get('/api/tipo-via')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        done();
      });
  });

  it('responde con un array', (done) => {
    request(app)
      .get('/api/tipo-via')
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body).to.be.an('array');

        done();
      });
  });

  it('responde con un array que no está vacío', (done) => {
    request(app)
      .get('/api/tipo-via')
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.length).to.be.above(0);

        done();
      });
  });

  it('cada tipo de vía tiene un id y un nombre', (done) => {
    request(app)
      .get('/api/tipo-via')
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        res.body.forEach(tipoVia => {
          expect(tipoVia).to.have.property('id');
          expect(tipoVia).to.have.property('nombre');
        });

        done();
      });
  });
});