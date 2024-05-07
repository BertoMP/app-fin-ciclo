import { GlucometriaListedModel } from "./glucometria-listed.model";

export interface GlucometriaListModel {
  cantidad_glucometrias: number;
  pagina_actual: number;
  paginas_totales: number;
  next: string;
  prev: string;
  limit: number;
  fechaInicio:string;
  fechaFin:string;
  glucometrias: GlucometriaListedModel[];
}
