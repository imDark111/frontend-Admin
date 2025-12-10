import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Usuario, ApiResponse } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  obtenerUsuarios(params?: any): Observable<ApiResponse<Usuario[]>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }
    return this.http.get<ApiResponse<Usuario[]>>(this.apiUrl, { params: httpParams });
  }

  obtenerUsuarioPorId(id: string): Observable<ApiResponse<Usuario>> {
    return this.http.get<ApiResponse<Usuario>>(`${this.apiUrl}/${id}`);
  }

  crearUsuario(usuario: Partial<Usuario>): Observable<ApiResponse<Usuario>> {
    return this.http.post<ApiResponse<Usuario>>(this.apiUrl, usuario);
  }

  actualizarUsuario(id: string, usuario: Partial<Usuario>): Observable<ApiResponse<Usuario>> {
    return this.http.put<ApiResponse<Usuario>>(`${this.apiUrl}/${id}`, usuario);
  }

  eliminarUsuario(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  cambiarPassword(data: { passwordActual: string; passwordNueva: string }): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/cambiar-password`, data);
  }

  cambiarFoto(formData: FormData): Observable<ApiResponse<Usuario>> {
    return this.http.put<ApiResponse<Usuario>>(`${this.apiUrl}/foto-perfil`, formData);
  }

  activarDesactivarUsuario(id: string, activo: boolean): Observable<ApiResponse<Usuario>> {
    return this.http.patch<ApiResponse<Usuario>>(`${this.apiUrl}/${id}/estado`, { activo });
  }
}
