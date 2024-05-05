import { createHistClinica } from "../functions/createHistClinica.js";
import { createEncryptedPassword } from "../functions/createEncryptedPassword.js";

class ObjectFactory {
	static async createUserObject(data) {
		return {
			email: data.datos_personales.email,
			password: await createEncryptedPassword(data.datos_personales.password),
			nombre: data.datos_personales.nombre,
			primer_apellido: data.datos_personales.primer_apellido,
			segundo_apellido: data.datos_personales.segundo_apellido,
			dni: data.datos_personales.dni,
			rol_id: (data.datos_paciente) ? 2 : 3,
		};
	}

	static createPacienteObject(data) {
		return {
			num_hist_clinica: createHistClinica(),
			fecha_nacimiento: data.datos_paciente.fecha_nacimiento,
			tipo_via: data.datos_paciente.datos_vivienda.tipo_via.id,
			nombre_via: data.datos_paciente.datos_vivienda.nombre_via,
			numero: data.datos_paciente.datos_vivienda.numero,
			piso: data.datos_paciente.datos_vivienda.piso,
			puerta: data.datos_paciente.datos_vivienda.puerta,
			municipio: data.datos_paciente.datos_vivienda.municipio.id,
			codigo_postal: data.datos_paciente.datos_vivienda.municipio.codigo_postal,
			tel_fijo: data.datos_paciente.datos_contacto.tel_fijo,
			tel_movil: data.datos_paciente.datos_contacto.tel_movil,
		}
	}

	static createEspecialistaObject(data) {
		return {
			num_colegiado: data.datos_especialista.num_colegiado,
			descripcion: data.datos_especialista.descripcion.replace(/(\r\n|\n|\r)/g, '<br>'),
			imagen: data.datos_especialista.imagen,
			turno: data.datos_especialista.turno,
			especialidad_id: data.datos_especialista.especialidad.especialidad_id,
			consulta_id: data.datos_especialista.consulta.consulta_id,
		};
	}

	static updateUserObject(data) {
		return {
			id: data.usuario_id,
			email: data.datos_personales.email,
			nombre: data.datos_personales.nombre,
			primer_apellido: data.datos_personales.primer_apellido,
			segundo_apellido: data.datos_personales.segundo_apellido,
			dni: data.datos_personales.dni,
			rol_id: (data.datos_paciente) ? 2 : 3,
		};
	}

	static updatePacienteObject(data) {
		return {
			id: data.usuario_id,
			fecha_nacimiento: data.datos_paciente.fecha_nacimiento,
			tipo_via: data.datos_paciente.datos_vivienda.tipo_via.id,
			nombre_via: data.datos_paciente.datos_vivienda.nombre_via,
			numero: data.datos_paciente.datos_vivienda.numero,
			piso: data.datos_paciente.datos_vivienda.piso,
			puerta: data.datos_paciente.datos_vivienda.puerta,
			municipio: data.datos_paciente.datos_vivienda.municipio.id,
			codigo_postal: data.datos_paciente.datos_vivienda.municipio.codigo_postal,
			tel_fijo: data.datos_paciente.datos_contacto.tel_fijo,
			tel_movil: data.datos_paciente.datos_contacto.tel_movil,
		}
	}

	static updateEspecialistaObject(data) {
		return {
			id: data.usuario_id,
			num_colegiado: data.datos_especialista.num_colegiado,
			descripcion: data.datos_especialista.descripcion.replace(/(\r\n|\n|\r)/g, '<br>'),
			imagen: data.datos_especialista.imagen,
			turno: data.datos_especialista.turno,
			especialidad_id: data.datos_especialista.especialidad.especialidad_id,
			consulta_id: data.datos_especialista.consulta.consulta_id,
		};
	}
}

export default ObjectFactory;
