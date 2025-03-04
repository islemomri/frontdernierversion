import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StageService {

  private apiUrl = 'http://localhost:9090/stages'; 

  constructor(private http: HttpClient) {}

  
  getStagesByEmployeId(employeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${employeId}/stages`);
  }

  
  addStageToEmploye(employeId: number, stage: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${employeId}`, stage);
  }

  
  removeStageFromEmploye(employeId: number, stageId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${employeId}/stages/${stageId}`);
  }

  
  updateStage(stageId: number, updatedStage: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${stageId}`, updatedStage);
  }
}