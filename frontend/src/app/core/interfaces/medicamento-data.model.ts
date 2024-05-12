import { MedicamentoTomasModel } from "./medicamento-tomas.model"

export interface MedicamentoDataModel {
    medicamento:{
        descripcion: string,
        id: number,
        nombre: string,
        tomas:MedicamentoTomasModel[]
    }
   
}

