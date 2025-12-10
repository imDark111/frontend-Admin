// Exportar entidades desde carpeta entidades
export * from './entidades';
import { Usuario, Departamento } from './entidades';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  requiresTwoFactor?: boolean;
  userId?: string;
  message?: string;
  data?: {
    usuario: Usuario;
    token: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  total?: number;
  page?: number;
  pages?: number;
  error?: any;
}

export interface DashboardEstadisticas {
  reservas: {
    total: number;
    activas: number;
    hoy: number;
  };
  departamentos: {
    total: number;
    disponibles: number;
    ocupados: number;
    mantenimiento: number;
  };
  finanzas: {
    ingresosTotales: number;
    ingresosMes: number;
  };
  usuarios: {
    total: number;
    clientes: number;
    frecuentes: number;
  };
  tasaOcupacion: number;
  reservasPorMes: Array<{
    _id: { año: number; mes: number };
    total: number;
    ingresos: number;
  }>;
  ingresosPorMes: Array<{
    _id: { año: number; mes: number };
    total: number;
  }>;
  topDepartamentos: Array<{
    _id: string;
    totalReservas: number;
    ingresoTotal: number;
    departamento: Departamento;
  }>;
}
