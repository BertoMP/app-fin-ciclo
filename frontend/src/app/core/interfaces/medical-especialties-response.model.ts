import {MedicalSpecialtyModel} from "./medical-specialty.model";

export interface MedicalEspecialtiesResponseModel {
  prev: string;
  next: string;
  pagina_actual: number;
  paginas_totales: number;
  cantidad_especialidades: number;
  items_pagina: number;
  result_min: number;
  result_max: number;
  resultados: MedicalSpecialtyModel[];
}
