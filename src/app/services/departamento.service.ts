import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Departamento, ApiResponse } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {
  private apiUrl = `${environment.apiUrl}/departamentos`;

  constructor(private http: HttpClient) { }

  obtenerDepartamentos(filtros?: any): Observable<ApiResponse<Departamento[]>> {
    let params = new HttpParams();
    if (filtros) {
      Object.keys(filtros).forEach(key => {
        if (filtros[key]) {
          params = params.set(key, filtros[key]);
        }
      });
    }
    return this.http.get<ApiResponse<Departamento[]>>(this.apiUrl, { params });
  }

  obtenerDepartamento(id: string): Observable<ApiResponse<Departamento>> {
    return this.http.get<ApiResponse<Departamento>>(`${this.apiUrl}/${id}`);
  }

  crearDepartamento(departamentoData: any): Observable<ApiResponse<Departamento>> {
    return this.http.post<ApiResponse<Departamento>>(this.apiUrl, departamentoData);
  }

  actualizarDepartamento(id: string, departamentoData: Partial<Departamento>): Observable<ApiResponse<Departamento>> {
    return this.http.put<ApiResponse<Departamento>>(`${this.apiUrl}/${id}`, departamentoData);
  }

  eliminarDepartamento(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`);
  }

  subirImagenes(id: string, imagenes: FormData): Observable<ApiResponse<Departamento>> {
    return this.http.post<ApiResponse<Departamento>>(`${this.apiUrl}/${id}/imagenes`, imagenes);
  }

  verificarDisponibilidad(id: string, fechaInicio: string, fechaFin: string): Observable<ApiResponse<any>> {
    const params = new HttpParams()
      .set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin);
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/${id}/disponibilidad`, { params });
  }
}
