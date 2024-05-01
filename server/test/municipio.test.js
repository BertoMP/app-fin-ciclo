const request = require('supertest');
const { app } = require('../app');

let expect;

describe('GET /api/municipio/:provincia_id', () => {
  before(async () => {
    expect = (await import('chai')).expect;
  });

  it('responde con un JSON con la lista de municipios de la provincia', (done) => {
    const provincia_id = 1;

    request(app)
      .get(`/api/municipio/${provincia_id}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        done();
      });
  });

  it('responde con un array', (done) => {
    const provincia_id = 1;

    request(app)
      .get(`/api/municipio/${provincia_id}`)
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body).to.be.an('array');

        done();
      });
  });

  it('responde con un array que no está vacío', (done) => {
    const provincia_id = 1;

    request(app)
      .get(`/api/municipio/${provincia_id}`)
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.length).to.be.above(0);

        done();
      });
  });

  it('cada municipio tiene un id y un nombre', (done) => {
    const provincia_id = 1;

    request(app)
      .get(`/api/municipio/${provincia_id}`)
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        res.body.forEach(municipio => {
          expect(municipio).to.have.property('id');
          expect(municipio).to.have.property('nombre');
        });

        done();
      });
  });

  it('responde con un error 400 cuando el id de la provincia no es válido', (done) => {
    const provincia_id = -1;

    request(app)
      .get(`/api/municipio/${provincia_id}`)
      .set('Accept', 'application/json')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);

        done();
      });
  });

  it('responde con un error 404 cuando la provincia no existe', (done) => {
    const provincia_id = 54;

    request(app)
      .get(`/api/municipio/${provincia_id}`)
      .set('Accept', 'application/json')
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);

        done();
      });
  });
});