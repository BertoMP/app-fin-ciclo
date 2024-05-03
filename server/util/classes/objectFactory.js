import { createHistClinica } from "../functions/createHistClinica.js";
import { createEncryptedPassword } from "../functions/createEncryptedPassword.js";

class ObjectFactory {
	static async createUserObject(data) {
		return {
			email: data.email,
			password: await createEncryptedPassword(data.password),
			nombre: data.nombre,
			primer_apellido: data.primer_apellido,
			segundo_apellido: data.segundo_apellido,
			dni: data.dni,
			rol_id: (data.fecha_nacimiento) ? 2 : 3,
		};
	}

	static createPacienteObject(data) {
		return {
			num_hist_clinica: createHistClinica(),
			fecha_nacimiento: data.fecha_nacimiento,
			tipo_via: data.tipo_via,
			nombre_via: data.nombre_via,
			numero: data.numero,
			piso: data.piso,
			puerta: data.puerta,
			municipio: data.municipio,
			codigo_postal: data.codigo_postal,
			tel_fijo: data.tel_fijo,
			tel_movil: data.tel_movil,
		}
	}

	static createEspecialistaObject(data) {
		return {
			num_colegiado: data.num_colegiado,
			descripcion: data.descripcion.replace(/(\r\n|\n|\r)/g, '<br>'),
			imagen: data.imagen,
			turno: data.turno,
			especialidad_id: data.especialidad_id,
			consulta_id: data.consulta_id,
		};
	}

	static createUpdateUsuarioObject(data) {
		return {
			usuario_id: data.usuario_id,
			email: data.email,
			nombre: data.nombre,
			primer_apellido: data.primer_apellido,
			segundo_apellido: data.segundo_apellido,
			dni: data.dni,
		};
	}

	static createUpdatePacienteObject(data) {
		return {
			usuario_id: data.usuario_id,
			fecha_nacimiento: data.fecha_nacimiento,
			tipo_via: data.tipo_via,
			nombre_via: data.nombre_via,
			numero: data.numero,
			piso: data.piso,
			puerta: data.puerta,
			municipio: data.municipio,
			codigo_postal: data.codigo_postal,
			tel_fijo: data.tel_fijo,
			tel_movil: data.tel_movil,
		}
	}

	static createUpdateEspecialistaObject(data) {
		return {
			usuario_id: data.usuario_id,
			num_colegiado: data.num_colegiado,
			descripcion: data.descripcion.replace(/(\r\n|\n|\r)/g, '<br>'),
			imagen: data.imagen,
			turno: data.turno,
			especialidad_id: data.especialidad_id,
			consulta_id: data.consulta_id,
		};
	}
}

export default ObjectFactory;
