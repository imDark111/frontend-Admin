import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonBackButton, IonCard, IonCardHeader, IonCardTitle,
  IonCardContent, IonButton, IonIcon, IonSegment,
  IonSegmentButton, IonLabel, IonDatetime, IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { downloadOutline, statsChartOutline } from 'ionicons/icons';
import { ReporteService } from '../../services/reporte.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.page.html',
  styleUrls: ['./reportes.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
    IonBackButton, IonCard, IonCardHeader, IonCardTitle,
    IonCardContent, IonButton, IonIcon, IonSegment,
    IonSegmentButton, IonLabel, IonSpinner
  ]
})
export class ReportesPage implements OnInit {
  tipoReporte: 'reservas' | 'financiero' | 'ocupacion' | 'clientes' = 'reservas';
  cargando = false;
  datos: any = null;

  constructor(private reporteService: ReporteService) {
    addIcons({ downloadOutline, statsChartOutline });
  }

  ngOnInit() {
    this.generarReporte();
  }

  cambiarTipo(event: any) {
    this.tipoReporte = event.detail.value;
    this.generarReporte();
  }

  generarReporte() {
    this.cargando = true;
    this.datos = null;

    // Sin filtro de fechas para cargar todos los datos históricos
    const params = {};

    let observable;
    switch (this.tipoReporte) {
      case 'reservas':
        observable = this.reporteService.reporteReservas(params);
        break;
      case 'financiero':
        observable = this.reporteService.reporteFinanciero(params);
        break;
      case 'ocupacion':
        observable = this.reporteService.reporteOcupacion({});
        break;
      case 'clientes':
        observable = this.reporteService.reporteClientes();
        break;
    }

    observable.subscribe({
      next: (response: any) => {
        console.log('Respuesta completa del backend:', response);
        console.log('Tipo de reporte:', this.tipoReporte);
        if (response.success) {
          console.log('Data antes de procesar:', response.data);
          this.datos = this.procesarDatos(response.data);
          console.log('Datos procesados:', this.datos);
        } else {
          console.error('Respuesta no exitosa:', response);
        }
        this.cargando = false;
      },
      error: (error: any) => {
        console.error('Error al cargar reporte:', error);
        console.error('Detalles del error:', error.error);
        this.cargando = false;
      }
    });
  }

  procesarDatos(data: any): any {
    switch (this.tipoReporte) {
      case 'reservas':
        return {
          totalReservas: data.estadisticas?.totalReservas || 0,
          confirmadas: data.estadisticas?.reservasPorEstado?.find((r: any) => r._id === 'confirmada')?.count || 0,
          completadas: data.estadisticas?.reservasPorEstado?.find((r: any) => r._id === 'completada')?.count || 0,
          canceladas: data.estadisticas?.reservasPorEstado?.find((r: any) => r._id === 'cancelada')?.count || 0,
          totalIngresos: data.estadisticas?.totalIngresos || 0,
          promedioIngreso: data.estadisticas?.promedioIngreso || 0,
          reservas: data.reservas || []
        };
      case 'financiero':
        return {
          ingresosTotales: data.estadisticas?.totalIngresos || 0,
          facturasPagadas: data.estadisticas?.facturasPorEstado?.find((f: any) => f._id === 'pagada')?.total || 0,
          facturasPendientes: data.estadisticas?.totalPendiente || 0,
          totalFacturas: data.estadisticas?.totalFacturas || 0,
          totalIVA: data.estadisticas?.totalIVA || 0,
          totalDescuentos: data.estadisticas?.totalDescuentos || 0,
          totalDanos: data.estadisticas?.totalDanos || 0,
          facturas: data.facturas || []
        };
      case 'ocupacion':
        return {
          tasaOcupacion: data.tasaOcupacionGeneral || 0,
          diasOcupados: data.totalDiasOcupados || 0,
          diasDisponibles: data.totalDiasDisponibles - (data.totalDiasOcupados || 0),
          periodo: data.periodo,
          ocupacionPorDepartamento: data.ocupacionPorDepartamento || []
        };
      case 'clientes':
        return {
          totalClientes: data.totalClientes || 0,
          clientesFrecuentes: data.clientesFrecuentes || 0,
          clientesNuevos: data.clientesNuevos || 0,
          topClientes: data.topClientes || []
        };
      default:
        return data;
    }
  }

  descargarReporte() {
    // Implementar descarga de reporte en PDF/Excel
    console.log('Descargando reporte...');
  }

  formatearMoneda(monto: number): string {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD'
    }).format(monto);
  }
}
