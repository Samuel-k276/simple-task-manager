import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<any> {
    console.log('Login attempt with:', credentials);
    return this.http.post<any>(`${this.apiUrl}/authenticate`, credentials)
      .pipe(
        tap(response => {
          console.log('Login response:', response);
          console.log('Raw token:', response.token);
          if (response && response.token) {
            console.log('Storing token...');
            localStorage.setItem('token', response.token);
            console.log('Token stored:', localStorage.getItem('token'));
          }
        })
      );
  }

  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, user);
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  getToken(): string | null {
    const token = localStorage.getItem('token');
    console.log('Getting token from storage:', token);
    const bearerToken = token ? `Bearer ${token}` : null;
    console.log('Returning bearer token:', bearerToken);
    return bearerToken;
  }
}
