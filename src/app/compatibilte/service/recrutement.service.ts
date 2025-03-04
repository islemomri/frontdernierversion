import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Candidat } from '../model/candidat';
import { Poste } from '../model/poste';

@Injectable({
  providedIn: 'root'
})
export class RecrutementService {

  private apiUrlPostes = 'http://localhost:9090/recrutement/postes';
  private apiUrlCandidats = 'http://localhost:9090/recrutement/candidats';
  private apiUrlSuggereCandidats = 'http://localhost:9090/recrutement/suggere'; // L'URL pour obtenir la liste des candidats recommandés

  constructor(private http: HttpClient) { }

  // Récupère tous les candidats
  getCandidats(): Observable<Candidat[]> {
    return this.http.get<Candidat[]>(this.apiUrlCandidats);
  }

  // Récupérer tous les postes
  getPostes(): Observable<Poste[]> {
    return this.http.get<Poste[]>(this.apiUrlPostes);
  }

  // Récupérer un poste par son ID
  getPosteById(posteId: number): Observable<Poste> {
    return this.http.get<Poste>(`${this.apiUrlPostes}/${posteId}`);
  }

  // Récupérer la liste des candidats suggérés pour un poste
  suggererCandidats(posteId: number): Observable<Candidat[]> {
    return this.http.get<Candidat[]>(`${this.apiUrlSuggereCandidats}/${posteId}`);
  }
}
