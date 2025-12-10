export interface Departamento {
  id: string;
  numero: string;
  tipo: 'individual' | 'doble' | 'matrimonial' | 'suite' | 'presidencial';
  descripcion?: string;
  piso: number;
  precioNoche: number;
  capacidadPersonas: number;
  numeroCamas: number;
  tipoCamas: 'individual' | 'matrimonial' | 'queen' | 'king' | 'mixta';
  caracteristicas: {
    televisor: boolean;
    wifi: boolean;
    aireAcondicionado: boolean;
    calefaccion: boolean;
    minibar: boolean;
    cajaFuerte: boolean;
    balcon: boolean;
    vistaAlMar: boolean;
    banoPrivado: boolean;
    jacuzzi: boolean;
    cocina: boolean;
    escritorio: boolean;
    secadorPelo: boolean;
    plancha: boolean;
    telefono: boolean;
  };
  imagenes: Array<{
    url: string;
    descripcion?: string;
  }>;
  estado: 'disponible' | 'ocupado' | 'mantenimiento' | 'reservado';
  observaciones?: string;
  createdAt: Date;
  updatedAt: Date;
}
