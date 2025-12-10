import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Log, ApiResponse } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private apiUrl = `${environment.apiUrl}/logs`;

  constructor(private http: HttpClient) { }

  obtenerLogs(filtros?: any): Observable<ApiResponse<Log[]>> {
    let params = new HttpParams();
    if (filtros) {
      Object.keys(filtros).forEach(key => {
        if (filtros[key] !== null && filtros[key] !== undefined && filtros[key] !== '') {
          params = params.set(key, filtros[key]);
        }
      });
    }
    return this.http.get<ApiResponse<Log[]>>(this.apiUrl, { params });
  }

  obtenerEstadisticasLogs(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/estadisticas`);
  }

  obtenerLog(id: string): Observable<ApiResponse<Log>> {
    return this.http.get<ApiResponse<Log>>(`${this.apiUrl}/${id}`);
  }
}
