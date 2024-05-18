import {InformesDataModel} from "./informes-data.model";

export interface InformesListModel {
  prev: string,
  next: string,
  pagina_actual: number,
  paginas_totales: number,
  cantidad_informes: number,
  result_min: number,
  result_max: number,
  fecha_inicio: string,
  fecha_fin: string,
  limit: number,
  items_pagina: number,
  citas: InformesDataModel[];
}
