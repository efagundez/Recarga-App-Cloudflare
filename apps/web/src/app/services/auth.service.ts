import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { ILoginRequest, ILoginResponse } from '@recarga/types';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  private authStatus = new BehaviorSubject<boolean>(this.hasToken());

  get isLoggedIn$() {
    return this.authStatus.asObservable();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  login(credentials: ILoginRequest) {
    return this.http.post<ILoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          // Store user details for other requests
          localStorage.setItem('vendedor', (response.vendedor || 0).toString());
          localStorage.setItem('grupo', response.grupo || '');
          this.authStatus.next(true);
        }
      }),
      catchError(error => throwError(() => new Error(error.error?.mensaje || 'Error iniciando sesión')))
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('vendedor');
    localStorage.removeItem('grupo');
    this.authStatus.next(false);
  }
}
