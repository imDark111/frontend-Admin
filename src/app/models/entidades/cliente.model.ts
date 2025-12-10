export interface Cliente {
  id: string;
  nombres: string;
  apellidos: string;
  cedula: string;
  fechaNacimiento: Date;
  email: string;
  telefono: string;
  direccion?: string;
  nacionalidad?: string;
  reservasRealizadas: number;
  esFrecuente: boolean;
  usuarioAsociado?: string;
  createdAt: Date;
  updatedAt: Date;
}
