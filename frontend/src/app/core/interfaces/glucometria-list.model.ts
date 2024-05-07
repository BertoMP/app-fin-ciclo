import { GlucometriaListedModel } from "./glucometria-listed.model";

export interface GlucometriaListModel {
  cantidad_glucometrias: number;
  items_pagina: number;
  next: string;
  pagina_actual: number;
  paginas_totales: number;
  prev: string;
  result_min: number;
  result_max: number;
  fecha_inicio:string;
  fecha_fin:string;
  resultados: GlucometriaListedModel[];
}
