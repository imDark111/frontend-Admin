import { Reserva } from './reserva.model';
import { Cliente } from './cliente.model';

export interface Factura {
  id: string;
  numeroFactura: string;
  reserva: Reserva | string;
  cliente: Cliente | string;
  fechaEmision: Date;
  subtotal: number;
  descuentos: {
    clienteFrecuente: number;
    otros: number;
  };
  iva: number;
  recargos: {
    feriado: number;
    otros: number;
  };
  danos: Array<{
    descripcion: string;
    monto: number;
    fecha: Date;
  }>;
  totalDanos: number;
  total: number;
  estadoPago: 'pendiente' | 'pagada' | 'parcial' | 'anulada';
  metodoPago?: string;
  pagos: Array<{
    fecha: Date;
    monto: number;
    metodo: string;
    referencia?: string;
  }>;
  observaciones?: string;
  createdAt: Date;
  updatedAt: Date;
}
