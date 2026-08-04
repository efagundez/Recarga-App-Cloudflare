import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { IVentaRequest, IVentaResponse, IProductosResponse, IUltimaTransaccionResponse } from '@recarga/types';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RechargeService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = environment.apiUrl;

  createRecharge(payload: IVentaRequest): Observable<IVentaResponse> {
    return this.http.post<IVentaResponse>(`${this.apiUrl}/venta`, payload, {
      headers: this.authService.getHeaders()
    }).pipe(
      catchError(error => throwError(() => new Error(error.error?.mensaje || 'Error al procesar la recarga')))
    );
  }

  getProductos(): Observable<IProductosResponse> {
    return this.http.post<IProductosResponse>(`${this.apiUrl}/productos`, {
      grupo: this.authService.session()?.grupo || '',
      id_vendedor: this.authService.session()?.vendedor || 0,
    }, { headers: this.authService.getHeaders() }).pipe(
      catchError(error => throwError(() => new Error(error.error?.mensaje || 'Error al obtener productos')))
    );
  }

  getSaldo(): Observable<{ codigo: string; saldo_actual: number }> {
    const session = this.authService.session();
    return this.http.post<{ codigo: string; saldo_actual: number }>(`${this.apiUrl}/saldo`, {
      id_vendedor: session?.vendedor || 0,
      grupo: session?.grupo || '',
    }, { headers: this.authService.getHeaders() }).pipe(
      catchError(error => throwError(() => new Error(error.error?.mensaje || 'Error al consultar saldo')))
    );
  }

  getUltimaTransaccion(): Observable<IUltimaTransaccionResponse> {
    const session = this.authService.session();
    return this.http.post<IUltimaTransaccionResponse>(`${this.apiUrl}/ult_transaccion`, {
      id_vendedor: session?.vendedor || 0,
      grupo: session?.grupo || '',
    }, { headers: this.authService.getHeaders() }).pipe(
      catchError(error => throwError(() => new Error(error.error?.mensaje || 'Error al obtener última transacción')))
    );
  }

  getTransacciones(): Observable<{ transacciones: any[] }> {
    const session = this.authService.session();
    return this.http.post<{ transacciones: any[] }>(`${this.apiUrl}/transacciones`, {
      id_vendedor: session?.vendedor || 0,
      grupo: session?.grupo || '',
    }, { headers: this.authService.getHeaders() }).pipe(
      catchError(error => throwError(() => new Error(error.error?.mensaje || 'Error al obtener transacciones')))
    );
  }
}
