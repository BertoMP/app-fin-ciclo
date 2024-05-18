import { CitasListedModel } from "./citas-listed.model";
import { MedicionListedModel } from "./medicion-listed.model";

export interface CitasListModel {
  prev: string,
  next: string,
  pagina_actual: number,
  paginas_totales: number,
  cantidad_citas: number,
  result_min: number,
  result_max: number,
  fecha_inicio: string,
  fecha_fin: string,
  limit: number,
  items_pagina: number,
  citas: CitasListedModel[];
}
