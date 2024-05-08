import { MedicionListedModel } from "./medicion-listed.model";

export interface MedicionListModel {
  cantidad_medicion: number;
  pagina_actual: number;
  paginas_totales: number;
  next: string;
  prev: string;
  limit: number;
  fechaInicio:string;
  fechaFin:string;
  mediciones: MedicionListedModel[];
}
