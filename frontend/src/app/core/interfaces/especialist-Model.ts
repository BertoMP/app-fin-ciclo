export interface EspecialistModel {
    nombre: string,
    primer_apellido: string,
    segundo_apellido: string,
    dni: string,
    email: string,
    password: string,
    consulta_id: number,
    especialidad_id: number,
    num_colegiado: string,
    imagen: string,
    descripcion:string,
    user_id?:number,
    turno:number
  }
  