import { Injectable } from '@angular/core';
import { TurnoEnum } from '../enum/turno.enum';

@Injectable({
  providedIn: 'root'
})
export class TurnoService {

  getTurno():String[]{
   return Object.values(TurnoEnum);
  }
}
