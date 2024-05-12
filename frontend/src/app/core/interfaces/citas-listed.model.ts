import { CitasDataModel } from "./citas-data.model"

export interface CitasListedModel {
    datos_paciente:{
      paciente_id:number,
      nombre:string,
      primer_apellido:string,
      segundo_apellido:string
    },
    citas:CitasDataModel[]
}
