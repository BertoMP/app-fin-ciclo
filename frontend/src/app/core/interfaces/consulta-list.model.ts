import {ConsultaModel} from "./consulta.model";

export interface ConsultaListModel {
  prev: string,
  next: string,
  pagina_actual: number,
  paginas_totales: number,
  cantidad_consultas: number,
  result_min: number,
  result_max: number,
  fecha_inicio: string,
  fecha_fin: string,
  limit: number,
  items_pagina: number,
  resultados: ConsultaModel[];
}
