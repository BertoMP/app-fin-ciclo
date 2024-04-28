import {MedicalSpecialistModel} from "./medical-specialist.model";

export interface MedicalSpecialistListModel {
  id:number;
  nombre: string;
  especialistas: MedicalSpecialistModel[];
}
