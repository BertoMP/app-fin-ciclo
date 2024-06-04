import { MedicamentoTomasModel } from "./medicamento-tomas.model";

export interface TomaInforme {
    id: number,
    nombre?:string,
    toma:MedicamentoTomasModel
  }
  