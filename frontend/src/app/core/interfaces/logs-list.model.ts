import {LogDataModel} from "./log-data.model";

export interface LogsListModel {
  prev: string,
  next: string,
  pagina_actual: number,
  paginas_totales: number,
  cantidad_logs: number,
  result_min: number,
  result_max: number,
  fecha_inicio: string,
  fecha_fin: string,
  limit: number,
  items_pagina: number,
  resultados: LogDataModel[];
}
