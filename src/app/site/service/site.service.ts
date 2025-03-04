import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Site } from '../model/site';

import { Poste } from '../../poste/model/poste';

@Injectable({
  providedIn: 'root'
})
export class SiteService {
  private apiUrl = 'http://localhost:9090/api/sites';

  private apiUrll = 'http://localhost:9090/recrutement/postes';

  constructor(private http: HttpClient) { }

  getAllSites(): Observable<Site[]> {
    return this.http.get<Site[]>(`${this.apiUrl}/non-archives`);
  }

/*  ajouterSite(site: Site): Observable<Site> {
    return this.http.post<Site>(`${this.apiUrl}/ajouter`, site);
  }
*/


ajouterSite(site: Site): Observable<Site> {
  return this.http.post<Site>(`${this.apiUrl}/ajouter`, site);
}
  
  deleteSite(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  archiverSite(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/archiver`, {});
  }

  getAllDirectionsArchivés(): Observable<Site[]> {
        return this.http.get<Site[]>(`${this.apiUrl}/liste-sites-archivés`);
      }


    






      desarchiverSite(id: number): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}/desarchiver`, {});
      }


   


}
