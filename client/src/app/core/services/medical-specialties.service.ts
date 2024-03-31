import { Injectable } from '@angular/core';
import {MedicalSpecialtyModel} from "../interfaces/medical-specialty.model";

@Injectable({
  providedIn: 'root'
})
export class MedicalSpecialtiesService {
  specialties: MedicalSpecialtyModel[]
    = [
    {
      title: 'Cardiología',
      description: 'Especialidad médica que se encarga del estudio del corazón y su funcionamiento.',
      image: 'assets/images/cardiology.jpg'
    },
    {
      title: 'Dermatología',
      description: 'Especialidad médica que se encarga del estudio de la piel y sus enfermedades.',
      image: 'assets/images/dermatology.jpg'
    },
    {
      title: 'Endocrinología',
      description: 'Especialidad médica que se encarga del estudio de las glándulas y sus enfermedades.',
      image: 'assets/images/endocrinology.jpg'
    },
    {
      title: 'Neurología',
      description: 'Especialidad médica que se encarga del estudio del sistema nervioso y sus enfermedades.',
      image: 'assets/images/neurology.jpg'
    }
  ]
  constructor() { }

  getSpecialties(): MedicalSpecialtyModel[] {
    return [...this.specialties];
  }
}
