import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private apiUrl = `${environment.apiUrl}/reportes`;

  constructor(private http: HttpClient) {}

  reporteReservas(params: {
    fechaInicio?: string;
    fechaFin?: string;
    estado?: string;
    departamento?: string;
  }): Observable<ApiResponse<any>> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key as keyof typeof params]) {
        httpParams = httpParams.set(key, params[key as keyof typeof params]!);
      }
    });
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/reservas`, { params: httpParams });
  }

  reporteFinanciero(params: {
    fechaInicio?: string;
    fechaFin?: string;
  }): Observable<ApiResponse<any>> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key as keyof typeof params]) {
        httpParams = httpParams.set(key, params[key as keyof typeof params]!);
      }
    });
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/financiero`, { params: httpParams });
  }

  reporteOcupacion(params: {
    fechaInicio?: string;
    fechaFin?: string;
  }): Observable<ApiResponse<any>> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key as keyof typeof params]) {
        httpParams = httpParams.set(key, params[key as keyof typeof params]!);
      }
    });
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/ocupacion`, { params: httpParams });
  }

  reporteClientes(params?: {
    frecuentes?: boolean;
  }): Observable<ApiResponse<any>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key as keyof typeof params] !== undefined) {
          httpParams = httpParams.set(key, params[key as keyof typeof params]!.toString());
        }
      });
    }
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/clientes`, { params: httpParams });
  }
}
