import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Discipline } from '../model/Discipline';

@Injectable({
  providedIn: 'root'
})
export class DisciplineService {
  private apiUrl = 'http://localhost:9090';

  constructor(private http: HttpClient) { }

  addDisciplineToEmploye(employeId: number, discipline: Discipline): Observable<Discipline> {
      return this.http.post<Discipline>(`${this.apiUrl}/disciplines/${employeId}/disciplines`, discipline);
    }
  
    getDisciplinesByEmployeId(employeId: number): Observable<Discipline[]> {
    return this.http.get<Discipline[]>(`${this.apiUrl}/disciplines/${employeId}/disciplines`);
  }
    removeDisciplineFromEmploye(employeId: number, disciplineId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/disciplines/${employeId}/disciplines/${disciplineId}`);
    }

    updateDiscipline(disciplineId: number, updatedDiscipline: Discipline): Observable<Discipline> {
      return this.http.put<Discipline>(`${this.apiUrl}/disciplines/disciplines/${disciplineId}`, updatedDiscipline);
    }
}