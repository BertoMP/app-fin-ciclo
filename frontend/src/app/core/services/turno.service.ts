import { Injectable } from '@angular/core';
import { TurnoEnum } from '../enum/turno.enum';

@Injectable({
  providedIn: 'root'
})
export class TurnoService {
  turno: {label: string, value: string}[] = [
    {
      label: 'Diurno',
      value: 'diurno'
    },
    {
      label: 'Vespertino',
      value: 'vespertino'
    },
    {
      label: 'No trabajando',
      value: 'no-trabajando'
    }
  ]

  getTurno():{label: string, value: string}[]{
   return [...this.turno]
  }
}
