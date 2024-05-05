import { SpecialityListedModel } from "./speciality-listed.model";

export interface ListedSpecialityModel {
  cantidad_especialidades: number;
  items_pagina: number;
  next: string;
  pagina_actual: number;
  paginas_totales: number;
  prev: string;
  result_min: number;
  result_max: number;
  resultados: SpecialityListedModel[];
}
