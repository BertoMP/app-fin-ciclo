import {PersonalDataModel} from "./personal-data.model";
import {RolDataModel} from "./rol-data.model";

export interface ListedUserModel {
  usuario_id: number,
  datos_personales: PersonalDataModel,
  datos_rol: RolDataModel,
  datos_turno?: string
}
