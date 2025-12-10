import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DashboardEstadisticas, Reserva, ApiResponse } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) { }

  obtenerEstadisticas(): Observable<ApiResponse<DashboardEstadisticas>> {
    return this.http.get<ApiResponse<DashboardEstadisticas>>(`${this.apiUrl}/estadisticas`);
  }

  obtenerReservasProximas(): Observable<ApiResponse<Reserva[]>> {
    return this.http.get<ApiResponse<Reserva[]>>(`${this.apiUrl}/reservas-proximas`);
  }

  obtenerCheckInsHoy(): Observable<ApiResponse<Reserva[]>> {
    return this.http.get<ApiResponse<Reserva[]>>(`${this.apiUrl}/checkins-hoy`);
  }

  obtenerCheckOutsHoy(): Observable<ApiResponse<Reserva[]>> {
    return this.http.get<ApiResponse<Reserva[]>>(`${this.apiUrl}/checkouts-hoy`);
  }

  obtenerTodosCheckIns(): Observable<ApiResponse<Reserva[]>> {
    return this.http.get<ApiResponse<Reserva[]>>(`${this.apiUrl}/checkins-todos`);
  }

  obtenerTodosCheckOuts(): Observable<ApiResponse<Reserva[]>> {
    return this.http.get<ApiResponse<Reserva[]>>(`${this.apiUrl}/checkouts-todos`);
  }
}
