export interface Usuario {
  id: string;
  nombreUsuario: string;
  email: string;
  nombres: string;
  apellidos: string;
  cedula: string;
  fechaNacimiento: Date;
  telefono?: string;
  direccion?: string;
  fotoPerfil: string;
  rol: 'cliente' | 'admin';
  twoFactorEnabled: boolean;
  activo: boolean;
  reservasRealizadas: number;
  esFrecuente: boolean;
  createdAt: Date;
  updatedAt: Date;
}
