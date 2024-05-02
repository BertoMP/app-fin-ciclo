import request from 'supertest';
import { app } from '../app.js';

let expect;

describe('GET /api/codigo-postal/:municipio_id', () => {
	before(async () => {
		expect = (await import('chai')).expect;
	});

	it('responde con un JSON con la lista de códigos postales del municipio', (done) => {
		const municipio_id = '01001';

		request(app)
			.get(`/api/codigo-postal/${municipio_id}`)
			.set('Accept', 'application/json')
			.expect('Content-Type', 'application/json; charset=utf-8')
			.expect(200)
			.end((err, res) => {
				if (err) return done(err);

				done();
			});
	});

	it('responde con un array', (done) => {
		const municipio_id = '01001';

		request(app)
			.get(`/api/codigo-postal/${municipio_id}`)
			.set('Accept', 'application/json')
			.expect(200)
			.end((err, res) => {
				if (err) return done(err);

				expect(res.body).to.be.an('array');

				done();
			});
	});

	it('responde con un array que no está vacío', (done) => {
		const municipio_id = '01001';

		request(app)
			.get(`/api/codigo-postal/${municipio_id}`)
			.set('Accept', 'application/json')
			.expect(200)
			.end((err, res) => {
				if (err) return done(err);

				expect(res.body.length).to.be.above(0);

				done();
			});
	});

	it('cada código postal tiene un id', (done) => {
		const municipio_id = '01001';

		request(app)
			.get(`/api/codigo-postal/${municipio_id}`)
			.set('Accept', 'application/json')
			.expect(200)
			.end((err, res) => {
				if (err) return done(err);

				res.body.forEach((codigoPostal) => {
					expect(codigoPostal).to.have.property('codigo_postal_id');
				});

				done();
			});
	});

	it('responde con un error 400 cuando el id del municipio no es válido', (done) => {
		const municipio_id = -1;

		request(app)
			.get(`/api/codigo-postal/${municipio_id}`)
			.set('Accept', 'application/json')
			.expect(400)
			.end((err, res) => {
				if (err) return done(err);

				done();
			});
	});

	it('responde con un error 404 cuando el municipio no existe', (done) => {
		const municipio_id = 1;

		request(app)
			.get(`/api/codigo-postal/${municipio_id}`)
			.set('Accept', 'application/json')
			.expect(404)
			.end((err, res) => {
				if (err) return done(err);

				done();
			});
	});
});
