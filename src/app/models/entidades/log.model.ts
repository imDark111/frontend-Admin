import { Usuario } from './usuario.model';

export interface Log {
  id: string;
  usuario?: Usuario | string;
  accion: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'LOGIN_FAILED' | 'REGISTER';
  entidad: string;
  entidadId?: string;
  ip?: string;
  userAgent?: string;
  metodo?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  ruta?: string;
  descripcion?: string;
  detalles?: any;
  exitoso: boolean;
  errorMensaje?: string;
  createdAt: Date;
  updatedAt: Date;
}
