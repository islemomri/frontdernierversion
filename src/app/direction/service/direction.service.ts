import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Direction } from '../model/Direction';
import { DirectionDTO } from '../model/DirectionDTO';
import { Site } from '../../site/model/site';

@Injectable({
  providedIn: 'root'
})
export class DirectionService {
  private apiUrl = 'http://localhost:9090/api/directions'; 
  constructor(private http: HttpClient) { }


  addDirection(directionDTO: DirectionDTO): Observable<any> {
    return this.http.post<any>(this.apiUrl, directionDTO);
  }

   getAllDirections(): Observable<Direction[]> {
      return this.http.get<Direction[]>(this.apiUrl);
    }


    getAllDirectionsArchivés(): Observable<Direction[]> {
      return this.http.get<Direction[]>(`${this.apiUrl}/liste-directions-archivés`);
    }


    desarchiverDirection(id: number): Observable<any> {
      return this.http.put(`${this.apiUrl}/${id}/desarchiver`, {});
    }

    archiverDirection(id: number): Observable<any> {
      return this.http.put(`${this.apiUrl}/${id}/archiver`, {});
    }

    updateDirection(id: number, directionDTO: DirectionDTO): Observable<Direction> {
      const url = `${this.apiUrl}/${id}`;  // Construction de l'URL avec l'ID
      return this.http.put<Direction>(url, directionDTO);  // Requête PUT pour mettre à jour la direction
    }



      getSitesByDirection(directionId: number): Observable<Site[]> {
        return this.http.get<Site[]>(`${this.apiUrl}/${directionId}/sites`);
      }

}
