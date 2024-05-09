import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {
  MedicalEspecialtiesResponseModel
} from "../interfaces/medical-especialties-response.model";

@Injectable({
  providedIn: 'root'
})
export class MedicalSpecialtiesService {
  baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getSpecialties(page: number) {
    return this.http.get<MedicalEspecialtiesResponseModel>(`${this.baseUrl}/especialidad?page=${page}&limit=4`);
  }
}
