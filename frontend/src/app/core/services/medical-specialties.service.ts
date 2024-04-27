import { Injectable } from '@angular/core';
import {MedicalSpecialtyModel} from "../interfaces/medical-specialty.model";

@Injectable({
  providedIn: 'root'
})
export class MedicalSpecialtiesService {
  specialties: MedicalSpecialtyModel[]
    = [
    {
      nombre: 'Cardiología',
      descripcion: 'Especialidad médica que se encarga del estudio del corazón y su funcionamiento.',
      imagen: 'assets/img/cardiologia.jpg'
    },
    {
      nombre: 'Dermatología',
      descripcion: 'Especialidad médica que se encarga del estudio de la piel y sus enfermedades.',
      imagen: 'assets/img/dermatologia.jpg'
    },
    {
      nombre: 'Endocrinología',
      descripcion: 'Especialidad médica que se encarga del estudio de las glándulas y sus enfermedades.',
      imagen: 'assets/img/endocrinologia.jpg'
    },
    {
      nombre: 'Neurología',
      descripcion: 'Especialidad médica que se encarga del estudio del sistema nervioso y sus enfermedades.',
      imagen: 'assets/img/neurologia.jpg'
    }
  ]
  constructor() { }

  getSpecialties(): MedicalSpecialtyModel[] {
    return [...this.specialties];
  }
}
