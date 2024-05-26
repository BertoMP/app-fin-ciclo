import { PatologiasDataModel } from "./patologias-data.model";

export interface PatologiasListModel {
    cantidad_patologias:number,
    items_pagina:number,
    next:string,
    prev:string,
    pagina_actual:number,
    paginas_totales:number,
    result_max:number,
    result_min:number,
    resultados:PatologiasDataModel[]
}