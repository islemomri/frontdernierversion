import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TypeDiplome } from '../model/type-diplome';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TypeDiplomeService {
  private apiUrl = 'http://localhost:9090/typediplomes';

  
    constructor(private http: HttpClient, private authservice: AuthService) {
    
    }

  getTypeDiplomeById(id: number): Observable<TypeDiplome> {
    return this.http.get<TypeDiplome>(`${this.apiUrl}/${id}`);
  }

  addTypeDiplome(typeDiplome: TypeDiplome): Observable<TypeDiplome> {
    return this.http.post<TypeDiplome>(`${this.apiUrl}/add`, typeDiplome);
  }
  
  updateTypeDiplome(id: number, typeDiplome: TypeDiplome): Observable<TypeDiplome> {
    return this.http.put<TypeDiplome>(`${this.apiUrl}/${id}`, typeDiplome);
  }
  archiverTypeDiplome(id: number): Observable<TypeDiplome> {
    return this.http.put<TypeDiplome>(`${this.apiUrl}/archiver/${id}`, {});
  }
  getAllTypeDiplomeNonArchives(): Observable<TypeDiplome[]> {
    return this.http.get<TypeDiplome[]>(`${this.apiUrl}`);
  }

  // Méthode pour récupérer tous les TypeDiplome archivés
  getAllTypeDiplomeArchives(): Observable<TypeDiplome[]> {
    return this.http.get<TypeDiplome[]>(`${this.apiUrl}/getallTypeDiplomeArchives`);
  }

  // Méthode pour désarchiver un TypeDiplome
  desarchiverTypeDiplome(id: number): Observable<TypeDiplome> {
    return this.http.put<TypeDiplome>(`${this.apiUrl}/desarchiver/${id}`, {});
  }


}
