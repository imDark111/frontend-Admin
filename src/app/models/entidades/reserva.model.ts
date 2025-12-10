import { Usuario } from './usuario.model';
import { Cliente } from './cliente.model';
import { Departamento } from './departamento.model';

export interface Reserva {
  id: string;
  codigoReserva: string;
  usuario: Usuario | string;
  cliente: Cliente | string;
  departamento: Departamento | string;
  fechaInicio: Date;
  fechaFin: Date;
  numeroNoches: number;
  numeroHuespedes: number;
  precioNoche: number;
  subtotal: number;
  descuentoClienteFrecuente: number;
  aplicaIVA: boolean;
  iva: number;
  esFeriado: boolean;
  recargoPorcentaje: number;
  recargoFeriado: number;
  total: number;
  estado: 'pendiente' | 'confirmada' | 'en-curso' | 'completada' | 'cancelada';
  checkIn: {
    realizado: boolean;
    fecha?: Date;
    realizadoPor?: string;
  };
  checkOut: {
    realizado: boolean;
    fecha?: Date;
    realizadoPor?: string;
  };
  observaciones?: string;
  solicitudesEspeciales?: string;
  createdAt: Date;
  updatedAt: Date;
}
