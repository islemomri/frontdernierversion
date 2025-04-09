import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FormationDto } from '../model/FormationDto.model';

@Injectable({
  providedIn: 'root'
})
export class FormationService {
  private apiUrl = 'http://localhost:9090/formations';
  constructor(private http: HttpClient) { }

  creerFormation(rhId: number, formation: FormationDto): Observable<FormationDto> {
    return this.http.post<FormationDto>(`${this.apiUrl}/${rhId}/creer`, formation);
  }
  getFormationsParRH(rhId: number): Observable<FormationDto[]> {
    return this.http.get<FormationDto[]>(`${this.apiUrl}/${rhId}`);
  }



}
