import { GlucometriaDataModel } from "./glucometria-data.model";

export interface GlucometriaListedModel {
    fecha: string,
    hora:string,
    datos_toma:GlucometriaDataModel
  }