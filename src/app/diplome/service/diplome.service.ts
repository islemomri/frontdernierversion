import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Diplome } from '../model/diplome';
import { DiplomeRequest } from '../model/diplome-request';
import { AuthService } from '../../auth/service/auth.service';
import { TypeDiplome } from '../model/type-diplome';

@Injectable({
  providedIn: 'root'
})
export class DiplomeService {
  private apiUrl = 'http://localhost:9090/diplomes';
  private typeDiplomeUrl = 'http://localhost:9090/typediplomes';
  headers : any;
  constructor(private http: HttpClient, private authservice: AuthService) {
    this.headers = this.authservice.createAuthorizationHeader();
  }
  
  getDiplomesByEmploye(employeId: number): Observable<Diplome[]> {
    return this.http.get<Diplome[]>(`${this.apiUrl}/employe/${employeId}`);
  }

  addDiplome(employeId: number, libelle: string, typeDiplomeId: number): Observable<Diplome> {
    return this.http.post<Diplome>(`${this.apiUrl}/add`, { employeId, libelle, typeDiplomeId });
  }  

  updateDiplome(diplomeId: number, libelle: string, typeDiplomeId: number): Observable<Diplome> {
    return this.http.put<Diplome>(`${this.apiUrl}/update/${diplomeId}`, { libelle, typeDiplomeId });
  }

  deleteDiplome(diplomeId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${diplomeId}`);
  }

  getTypeDiplomes(): Observable<TypeDiplome[]> {
    return this.http.get<TypeDiplome[]>(`${this.typeDiplomeUrl}/all`);
  }
}
