import { RolDataModel } from "./rol-data.model"

export interface PatientModel {
    usuario_id: number,
    datos_personales: {
        nombre: string
        primer_apellido: string,
        segundo_apellido: string,
        email: string,
        dni: string,
        password?: string
    },
    datos_paciente: {
        fecha_nacimiento: string,
        num_historia_clinica: string,
        datos_contacto: {
            tel_fijo: string,
            tel_movil: string
        },
        datos_vivienda: {
            nombre_via: string,
            numero: number,
            piso:number,
            puerta:string,
            municipio:{
                id:number,
                nombre?:string,
                codigo_postal:number
            },
            provincia?:{
                id:number,
                nombre?:string,
            },
            tipo_via:{
                id:number,
                nombre?:string
            }
        }
    },
    datos_rol?: RolDataModel

}