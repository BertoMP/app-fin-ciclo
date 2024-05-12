import { DatosPacienteModel } from "./datos-paciente.model"
import { MedicamentoDataModel } from "./medicamento-data.model"

export interface MedicacionListModel {
    datos_paciente:DatosPacienteModel,
    prescripciones: MedicamentoDataModel[]

}
