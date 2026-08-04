import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, tap, catchError, throwError, Observable } from 'rxjs';
import { ILoginRequest, ILoginResponse, IVentaRequest, IVentaResponse, IProductosResponse, IUltimaTransaccionResponse } from '@recarga/types';
import { environment } from '../../environments/environment';

export interface UserSession {
  token: string;
  vendedor: number;
  grupo: string;
  usuario?: string;
  nombre?: string;
  saldo?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.apiUrl;

  // Estado reactivo de sesión
  private _session = new BehaviorSubject<UserSession | null>(this.loadSession());
  session$ = this._session.asObservable();
  isLoggedIn$ = new BehaviorSubject<boolean>(!!this.loadSession());

  // Señales para uso en templates Angular moderno
  session = signal<UserSession | null>(this.loadSession());
  isLoggedIn = computed(() => !!this.session());

  private loadSession(): UserSession | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return {
      token,
      vendedor: Number(localStorage.getItem('vendedor') || 0),
      grupo: localStorage.getItem('grupo') || '',
      saldo: Number(localStorage.getItem('saldo') || 0),
    };
  }

  getHeaders(): HttpHeaders {
    const token = this.session()?.token || localStorage.getItem('token') || '';
    return new HttpHeaders({ 'Authorization': `Token ${token}` });
  }

  login(credentials: ILoginRequest): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response?.token) {
          const sessionData: UserSession = {
            token: response.token,
            vendedor: response.vendedor || 0,
            grupo: response.grupo || credentials.grupo,
            saldo: response.saldo || 0,
          };
          localStorage.setItem('token', sessionData.token);
          localStorage.setItem('vendedor', sessionData.vendedor.toString());
          localStorage.setItem('grupo', sessionData.grupo);
          localStorage.setItem('saldo', (sessionData.saldo || 0).toString());

          this._session.next(sessionData);
          this.isLoggedIn$.next(true);
          this.session.set(sessionData);
        }
      }),
      catchError(error => throwError(() => new Error(error.error?.mensaje || 'Credenciales inválidas.')))
    );
  }

  logout() {
    localStorage.clear();
    this._session.next(null);
    this.isLoggedIn$.next(false);
    this.session.set(null);
    this.router.navigate(['/']);
  }

  updateSaldo(nuevoSaldo: number) {
    const current = this.session();
    if (current) {
      const updated = { ...current, saldo: nuevoSaldo };
      localStorage.setItem('saldo', nuevoSaldo.toString());
      this._session.next(updated);
      this.session.set(updated);
    }
  }
}
