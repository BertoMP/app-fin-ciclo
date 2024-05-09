import { GlucometriaDataModel } from "./glucometria-data.model";
import { TensionArterialDataModel } from "./tension-arterial-data.model";

export interface MedicionListedModel {
    fecha: string,
    hora:string,
    datos_toma:GlucometriaDataModel | TensionArterialDataModel | null
  }