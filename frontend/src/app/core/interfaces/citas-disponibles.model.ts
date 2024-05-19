export interface CitaSpecificDataModel {
    prev:string,
    next:string,
    pagina_actual:number,
    paginas_totales:number,
    cantidad_citas:number,
    result_min:number,
    result_max:number,
    items_pagina:number
    datos_agenda:{
        fecha_cita:string,
        especialista_id:string,
        citas_disponibles:string;
    }
}
