import { CitasDataModel } from "./citas-data.model"
import { DatosPacienteModel } from "./datos-paciente.model"

export interface CitasListedModel {
    datos_paciente:DatosPacienteModel,
    citas:CitasDataModel[]
}
