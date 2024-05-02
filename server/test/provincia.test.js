import request from 'supertest';

import { app } from '../app.js';

let expect;

describe('GET /api/provincia', () => {
	before(async () => {
		expect = (await import('chai')).expect;
	});

	it('responde con un JSON con la lista de provincias', (done) => {
		request(app)
			.get('/api/provincia')
			.set('Accept', 'application/json')
			.expect('Content-Type', 'application/json; charset=utf-8')
			.expect(200)
			.end((err, res) => {
				if (err) return done(err);

				// console.log(res.body);

				done();
			});
	});

	it('responde con un array', (done) => {
		request(app)
			.get('/api/provincia')
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
			.get('/api/provincia')
			.set('Accept', 'application/json')
			.expect(200)
			.end((err, res) => {
				if (err) return done(err);

				expect(res.body.length).to.be.above(0);

				done();
			});
	});

	it('cada provincia tiene un id y un nombre', (done) => {
		request(app)
			.get('/api/provincia')
			.set('Accept', 'application/json')
			.expect(200)
			.end((err, res) => {
				if (err) return done(err);

				res.body.forEach((provincia) => {
					expect(provincia).to.have.property('id');
					expect(provincia).to.have.property('nombre');
				});

				done();
			});
	});
});
