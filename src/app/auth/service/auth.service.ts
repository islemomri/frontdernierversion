import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from '../../../auth.config';
import { LoginRequest } from '../model/login-request';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = "http://localhost:9090/";
  
  constructor(private http: HttpClient, private router:Router) {
   
   }

  registerRH(SignupRequest: any): Observable<any> {
    SignupRequest.role= 'RH';
    const url = this.baseUrl + 'signup/rh';
    const headers = this.createAuthorizationHeader();
    return this.http.post(url, SignupRequest);
  }

  registerDirecteur(SignupRequest: any): Observable<any> {
    SignupRequest.role = 'DIRECTEUR';
    const url = this.baseUrl + 'signup/directeur';
    const headers = this.createAuthorizationHeader();
    return this.http.post(url, SignupRequest);
  }

  registerResponsable(SignupRequest: any): Observable<any> {
    SignupRequest.role = 'RESPONSABLE';
    const url = this.baseUrl + 'signup/responsable';
    const headers = this.createAuthorizationHeader();
    return this.http.post(url, SignupRequest);
  }
  

  

  login(loginRequest: LoginRequest): Observable<any> {
    return this.http.post<any>(this.baseUrl + "login", loginRequest).pipe(
      map(response => {
      
        if (response && response.jwt) {
          localStorage.setItem('jwt', response.jwt);
          localStorage.setItem('userId', response.utilisateurId);
          localStorage.setItem('userRole', response.role);
        }
        return response;
      })
    );
  }
  

  saveTokenAndRole(token: string, roles: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', roles);

  }
  

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }  
  

  createAuthorizationHeader(): HttpHeaders {
    const jwtToken = localStorage.getItem('jwt');
    if (jwtToken) {
      console.log("JWT token found in local storage", jwtToken);
      return new HttpHeaders().set("Authorization", "Bearer " + jwtToken);
    } else {
      console.log("JWT token not found in local storage");
      return new HttpHeaders();
    }
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('jwt') != null;
  }

  logout(): void {
    localStorage.removeItem('jwt');
    console.log("token remove")
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const isLoggedIn = !!localStorage.getItem('jwt');
    if (isLoggedIn) {
    }
    return isLoggedIn;
  }
  
}
