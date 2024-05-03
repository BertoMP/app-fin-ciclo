import {ListedUserModel} from "./listed-user.model";

export interface UserListResponseModel {
  cantidad_usuarios: number;
  items_pagina: number;
  next: string;
  pagina_actual: number;
  paginas_totales: number;
  prev: string;
  result_min: number;
  result_max: number;
  resultados: ListedUserModel[];
}
