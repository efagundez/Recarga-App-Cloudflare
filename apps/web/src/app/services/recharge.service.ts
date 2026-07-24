import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { IVentaRequest, IVentaResponse, IProductosResponse, IUltimaTransaccionResponse } from '@recarga/types';

@Injectable({
  providedIn: 'root'
})
export class RechargeService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Token ${token}`
    });
  }

  /** Realiza una venta/recarga */
  createRecharge(payload: IVentaRequest): Observable<IVentaResponse> {
    return this.http.post<IVentaResponse>(`${this.apiUrl}/venta`, payload, { headers: this.getHeaders() }).pipe(
      catchError(error =>
        throwError(() => new Error(error.error?.mensaje || 'Error al crear la recarga'))
      )
    );
  }

  /** Obtiene la lista de productos */
  getProductos(): Observable<IProductosResponse> {
    return this.http.get<IProductosResponse>(`${this.apiUrl}/productos`, { headers: this.getHeaders() }).pipe(
      catchError(error =>
        throwError(() => new Error(error.error?.mensaje || 'Error al obtener los productos'))
      )
    );
  }
  
  /** Obtiene la ultima transaccion */
  getUltimaTransaccion(payload: { id_vendedor: number, grupo: string }): Observable<IUltimaTransaccionResponse> {
    return this.http.post<IUltimaTransaccionResponse>(`${this.apiUrl}/ult_transaccion`, payload, { headers: this.getHeaders() }).pipe(
      catchError(error =>
        throwError(() => new Error(error.error?.mensaje || 'Error al obtener ultima transaccion'))
      )
    );
  }
}
