import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Reserva, ApiResponse } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private apiUrl = `${environment.apiUrl}/reservas`;

  constructor(private http: HttpClient) { }

  obtenerReservas(filtros?: any): Observable<ApiResponse<Reserva[]>> {
    let params = new HttpParams();
    if (filtros) {
      Object.keys(filtros).forEach(key => {
        if (filtros[key]) {
          params = params.set(key, filtros[key]);
        }
      });
    }
    return this.http.get<ApiResponse<Reserva[]>>(this.apiUrl, { params });
  }

  obtenerReserva(id: string): Observable<ApiResponse<Reserva>> {
    return this.http.get<ApiResponse<Reserva>>(`${this.apiUrl}/${id}`);
  }

  crearReserva(reservaData: any): Observable<ApiResponse<Reserva>> {
    return this.http.post<ApiResponse<Reserva>>(this.apiUrl, reservaData);
  }

  actualizarReserva(id: string, reservaData: Partial<Reserva>): Observable<ApiResponse<Reserva>> {
    return this.http.put<ApiResponse<Reserva>>(`${this.apiUrl}/${id}`, reservaData);
  }

  cancelarReserva(id: string): Observable<ApiResponse<Reserva>> {
    return this.http.put<ApiResponse<Reserva>>(`${this.apiUrl}/${id}/cancelar`, {});
  }

  checkIn(id: string): Observable<ApiResponse<Reserva>> {
    return this.http.put<ApiResponse<Reserva>>(`${this.apiUrl}/${id}/checkin`, {});
  }

  checkOut(id: string): Observable<ApiResponse<Reserva>> {
    return this.http.put<ApiResponse<Reserva>>(`${this.apiUrl}/${id}/checkout`, {});
  }
}
