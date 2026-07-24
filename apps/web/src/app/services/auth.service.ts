import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  // Asumiendo que la API está corriendo en http://localhost:3000
  // idealmente esto se guarda en un enviroment.ts
  private apiUrl = 'http://localhost:3000/api/auth';

  private authStatus = new BehaviorSubject<boolean>(this.hasToken());

  get isLoggedIn$() {
    return this.authStatus.asObservable();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  login(credentials: any) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.authStatus.next(true);
        }
      }),
      catchError(error => throwError(() => new Error(error.error?.message || 'Error iniciando sesión')))
    );
  }

  register(userData: any) {
    return this.http.post<any>(`${this.apiUrl}/register`, userData).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.authStatus.next(true);
        }
      }),
      catchError(error => throwError(() => new Error(error.error?.message || 'Error registrando la cuenta')))
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authStatus.next(false);
  }
}
