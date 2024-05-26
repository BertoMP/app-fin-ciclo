import { MedicinasDataModel } from "./medicinas-data.model";

export interface MedicinasListModel {
    cantidad_medicamentos:number,
    items_pagina:number,
    next:string,
    prev:string,
    pagina_actual:number,
    paginas_totales:number,
    result_max:number,
    result_min:number,
    resultados:MedicinasDataModel[]
}