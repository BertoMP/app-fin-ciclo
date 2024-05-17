import { PatologiaDataModel } from "./patologia-specific-data.model"

export interface InformeSpecificData {
    datos_cita: {
        id: number,
        fecha: string,
        hora: string,
    },
    datos_especialista: {
        usuario_id: number,
        especialidad: string,
        num_colegiado: string,
        datos_personales: {
            email: string,
            nombre: string,
            primer_apellido:string,
            segundo_apellido:string
        },
    },
    datos_informe: {
        id: number,
        motivo: string,
        contenido: string,
        patologias: PatologiaDataModel[],
    },

    datos_paciente:{
        usuario_id:number,
        num_historia_clinica:string
        datos_personales: {
            nombre: string
            primer_apellido: string,
            segundo_apellido: string,
            email: string,
            dni: string,
            password?: string
        },
        datos_vivienda: {
            codigo_postal: string
            municipio: string,
            nombre_via: string,
            numero: number,
            piso: number,
            provincia:string,
            puerta:string,
            tipo_via:string,
        },
        telefonos:{
            tel_fijo:number,
            tel_movil:number
        }
    }
}