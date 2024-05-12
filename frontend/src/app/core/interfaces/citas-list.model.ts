import { MedicionListedModel } from "./medicion-listed.model";

export interface CitasListModel {
  pagina_actual: number;
  paginas_totales: number;
  cantidad_citas:number;
  next: string;
  prev: string;
  citas: MedicionListedModel[];
}
