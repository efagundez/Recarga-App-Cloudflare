import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { IRecharge, IRechargeCreate, IApiResponse } from '@recarga/types';

@Injectable({
  providedIn: 'root'
})
export class RechargeService {
  private http = inject(HttpClient);
  // Base URL of the Next.js API – ideally pulled from environment config
  private apiUrl = 'http://localhost:3000/api/recharges';

  /** Fetch all recharges for the current user. */
  getRecharges(): Observable<IApiResponse<IRecharge[]>> {
    return this.http.get<IApiResponse<IRecharge[]>>(this.apiUrl).pipe(
      catchError(error =>
        throwError(() => new Error(error.error?.message || 'Error al obtener las recargas'))
      )
    );
  }

  /** Create a new recharge. */
  createRecharge(payload: IRechargeCreate): Observable<IApiResponse<IRecharge>> {
    return this.http.post<IApiResponse<IRecharge>>(this.apiUrl, payload).pipe(
      catchError(error =>
        throwError(() => new Error(error.error?.message || 'Error al crear la recarga'))
      )
    );
  }

  /** Get a single recharge by ID. */
  getRechargeById(id: string): Observable<IApiResponse<IRecharge>> {
    return this.http.get<IApiResponse<IRecharge>>(`${this.apiUrl}/${id}`).pipe(
      catchError(error =>
        throwError(() => new Error(error.error?.message || 'Error al obtener la recarga'))
      )
    );
  }
}
