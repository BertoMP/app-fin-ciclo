import { Injectable } from '@angular/core';
import {
  MedicalSpecialistListModel
} from "../interfaces/medical-specialist-list.model";

@Injectable({
  providedIn: 'root'
})
export class MedicalSpecialistListService {
  medicalSpecialists: MedicalSpecialistListModel[] = [
    {
      specialty: 'Cardiología',
      medicalSpecialists: [
        {
          'name': 'John',
          'surname': 'Doe',
          'description': 'Cardiologist',
          'image': 'https://via.placeholder.com/150'
        },
        {
          'name': 'Jane',
          'surname': 'Doe',
          'description': 'Cardiologist',
          'image': 'https://via.placeholder.com/150'
        },
        {
          'name': 'John',
          'surname': 'Doe',
          'description': 'Cardiologist',
          'image': 'https://via.placeholder.com/150'
        },
        {
          'name': 'Jane',
          'surname': 'Doe',
          'description': 'Cardiologist',
          'image': 'https://via.placeholder.com/150'
        },
      ]
    },
    {
      specialty: 'Dermatología',
      medicalSpecialists: [
        {
          'name': 'John',
          'surname': 'Doe',
          'description': 'Dermatologist',
          'image': 'https://via.placeholder.com/150'
        },
        {
          'name': 'Jane',
          'surname': 'Doe',
          'description': 'Dermatologist',
          'image': 'https://via.placeholder.com/150'
        }
      ]
    },
    {
      specialty: 'Endocrinología',
      medicalSpecialists: [
        {
          'name': 'John',
          'surname': 'Doe',
          'description': 'Endocrinologist',
          'image': 'https://via.placeholder.com/150'
        },
        {
          'name': 'Jane',
          'surname': 'Doe',
          'description': 'Endocrinologist',
          'image': 'https://via.placeholder.com/150'
        },
      ]
    },
    {
      specialty: 'Neurología',
      medicalSpecialists: [
        {
          'name': 'John',
          'surname': 'Doe',
          'description': 'Gastroenterologist',
          'image': 'https://via.placeholder.com/150'
        },
        {
          'name': 'Jane',
          'surname': 'Doe',
          'description': 'Gastroenterologist',
          'image': 'https://via.placeholder.com/150'
        }
      ]
    },
  ]

  constructor() { }

  getMedicalSpecialistList(): MedicalSpecialistListModel[] {
    return [...this.medicalSpecialists];
  }
}
