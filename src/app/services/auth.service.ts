import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Usuario, LoginRequest, LoginResponse, ApiResponse } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject: BehaviorSubject<Usuario | null>;
  public currentUser: Observable<Usuario | null>;
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) {
    const user = this.getUserFromStorage();
    this.currentUserSubject = new BehaviorSubject<Usuario | null>(user);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): Usuario | null {
    return this.currentUserSubject.value;
  }

  public get token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.setSession(response.data.usuario, response.data.token);
          }
        })
      );
  }

  verify2FA(userId: string, code: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/verify-2fa`, { userId, token: code })
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.setSession(response.data.usuario, response.data.token);
          }
        })
      );
  }

  register(userData: any): Observable<ApiResponse<{ usuario: Usuario, token: string }>> {
    return this.http.post<ApiResponse<{ usuario: Usuario, token: string }>>(
      `${this.apiUrl}/auth/register`, 
      userData
    ).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.setSession(response.data.usuario, response.data.token);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('current_user');
    this.currentUserSubject.next(null);
  }

  getMe(): Observable<ApiResponse<Usuario>> {
    return this.http.get<ApiResponse<Usuario>>(`${this.apiUrl}/auth/me`)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.currentUserSubject.next(response.data);
            this.saveUserToStorage(response.data);
          }
        })
      );
  }

  enable2FA(): Observable<ApiResponse<{ qrCode: string, secret: string }>> {
    return this.http.post<ApiResponse<{ qrCode: string, secret: string }>>(
      `${this.apiUrl}/auth/enable-2fa`, 
      {}
    );
  }

  confirm2FA(token: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/auth/confirm-2fa`, { token });
  }

  disable2FA(password: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/auth/disable-2fa`, { password });
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  isAdmin(): boolean {
    return this.currentUserValue?.rol === 'admin';
  }

  private setSession(usuario: Usuario, token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.saveUserToStorage(usuario);
    this.currentUserSubject.next(usuario);
  }

  private saveUserToStorage(usuario: Usuario): void {
    localStorage.setItem('current_user', JSON.stringify(usuario));
  }

  private getUserFromStorage(): Usuario | null {
    const userStr = localStorage.getItem('current_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.token;
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  actualizarFotoPerfil(fotoPerfil: string): void {
    const currentUser = this.currentUserValue;
    if (currentUser) {
      currentUser.fotoPerfil = fotoPerfil;
      this.saveUserToStorage(currentUser);
      this.currentUserSubject.next(currentUser);
    }
  }
}
