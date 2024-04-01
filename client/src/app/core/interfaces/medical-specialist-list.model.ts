import {MedicalSpecialistModel} from "./medical-specialist.model";

export interface MedicalSpecialistListModel {
  specialty: string;
  medicalSpecialists: MedicalSpecialistModel[];
}
