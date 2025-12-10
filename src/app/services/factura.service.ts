import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Factura, ApiResponse } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  private apiUrl = `${environment.apiUrl}/facturas`;

  constructor(private http: HttpClient) {}

  obtenerFacturas(params?: any): Observable<ApiResponse<Factura[]>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }
    return this.http.get<ApiResponse<Factura[]>>(this.apiUrl, { params: httpParams });
  }

  obtenerFacturaPorId(id: string): Observable<ApiResponse<Factura>> {
    return this.http.get<ApiResponse<Factura>>(`${this.apiUrl}/${id}`);
  }

  obtenerFacturaPorNumero(numero: string): Observable<ApiResponse<Factura>> {
    return this.http.get<ApiResponse<Factura>>(`${this.apiUrl}/numero/${numero}`);
  }

  crearFactura(data: { reservaId: string }): Observable<ApiResponse<Factura>> {
    return this.http.post<ApiResponse<Factura>>(this.apiUrl, data);
  }

  agregarDano(id: string, dano: { descripcion: string; monto: number }): Observable<ApiResponse<Factura>> {
    return this.http.post<ApiResponse<Factura>>(`${this.apiUrl}/${id}/danos`, dano);
  }

  registrarPago(id: string, pago: { monto: number; metodo: string; referencia?: string }): Observable<ApiResponse<Factura>> {
    return this.http.post<ApiResponse<Factura>>(`${this.apiUrl}/${id}/pagos`, pago);
  }

  anularFactura(id: string, motivo: string): Observable<ApiResponse<Factura>> {
    return this.http.patch<ApiResponse<Factura>>(`${this.apiUrl}/${id}/anular`, { motivo });
  }

  autoGenerarFacturas(): Observable<ApiResponse<Factura[]>> {
    return this.http.post<ApiResponse<Factura[]>>(`${this.apiUrl}/auto-generar`, {});
  }
}
