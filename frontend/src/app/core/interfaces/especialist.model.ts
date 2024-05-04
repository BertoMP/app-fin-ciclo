import { RolDataModel } from "./rol-data.model"

export interface EspecialistModel {
    usuario_id: number,
    datos_personales: {
        nombre: string
        primer_apellido: string,
        segundo_apellido: string,
        email: string,
        dni: string,
        password: string
    },
    datos_especialista: {
        num_colegiado: string,
        descripcion: string,
        imagen: string,
        turno:string,
        especialidad: {
            especialidad_id: number,
            especialidad?: string
        },
        consulta: {
            consulta_id: number,
            consulta_nombre?: string
        }
    },
    datos_rol?: RolDataModel

}