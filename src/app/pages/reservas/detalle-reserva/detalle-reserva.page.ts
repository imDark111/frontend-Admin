import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonBackButton, IonCard, IonCardHeader, IonCardTitle,
  IonCardContent, IonList, IonItem, IonLabel, IonBadge,
  IonButton, IonIcon, IonSpinner, IonAlert, IonToast
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  calendarOutline, personOutline, bedOutline, cashOutline,
  checkmarkCircleOutline, closeCircleOutline, documentsOutline
} from 'ionicons/icons';
import { ReservaService } from '../../../services/reserva.service';
import { Reserva } from '../../../models/interfaces';

@Component({
  selector: 'app-detalle-reserva',
  templateUrl: './detalle-reserva.page.html',
  styleUrls: ['./detalle-reserva.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
    IonBackButton, IonCard, IonCardHeader, IonCardTitle,
    IonCardContent, IonList, IonItem, IonLabel, IonBadge,
    IonButton, IonIcon, IonSpinner, IonAlert, IonToast
  ]
})
export class DetalleReservaPage implements OnInit {
  reserva: Reserva | null = null;
  cargando = true;
  mostrarAlertCancelar = false;
  mostrarAlertCheckIn = false;
  mostrarAlertCheckOut = false;
  mostrarToast = false;
  mensajeToast = '';

  botonesCheckIn = [
    { text: 'Cancelar', role: 'cancel', handler: () => { this.mostrarAlertCheckIn = false; } },
    { text: 'Confirmar', handler: () => { this.realizarCheckIn(); this.mostrarAlertCheckIn = false; } }
  ];

  botonesCheckOut = [
    { text: 'Cancelar', role: 'cancel', handler: () => { this.mostrarAlertCheckOut = false; } },
    { text: 'Confirmar', handler: () => { this.realizarCheckOut(); this.mostrarAlertCheckOut = false; } }
  ];

  botonesCancelar = [
    { text: 'No', role: 'cancel', handler: () => { this.mostrarAlertCancelar = false; } },
    { text: 'Sí, cancelar', role: 'destructive', handler: () => { this.cancelarReserva(); } }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservaService: ReservaService
  ) {
    addIcons({ 
      calendarOutline, personOutline, bedOutline, cashOutline,
      checkmarkCircleOutline, closeCircleOutline, documentsOutline
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarReserva(id);
    }
  }

  cargarReserva(id: string) {
    this.cargando = true;
    this.reservaService.obtenerReserva(id).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.reserva = response.data;
        }
        this.cargando = false;
      },
      error: (error: any) => {
        console.error('Error al cargar reserva:', error);
        this.cargando = false;
      }
    });
  }

  realizarCheckIn() {
    if (!this.reserva) return;
    
    this.reservaService.checkIn(this.reserva.id).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.mensajeToast = 'Check-in realizado exitosamente';
          this.mostrarToast = true;
          this.cargarReserva(this.reserva!.id);
        }
      },
      error: (error: any) => {
        this.mensajeToast = 'Error al realizar check-in';
        this.mostrarToast = true;
      }
    });
  }

  realizarCheckOut() {
    if (!this.reserva) return;
    
    this.reservaService.checkOut(this.reserva.id).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.mensajeToast = 'Check-out realizado exitosamente';
          this.mostrarToast = true;
          this.cargarReserva(this.reserva!.id);
        }
      },
      error: (error: any) => {
        this.mensajeToast = 'Error al realizar check-out';
        this.mostrarToast = true;
      }
    });
  }

  cancelarReserva() {
    if (!this.reserva) return;
    
    this.reservaService.cancelarReserva(this.reserva.id).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.mensajeToast = 'Reserva cancelada exitosamente';
          this.mostrarToast = true;
          this.mostrarAlertCancelar = false;
          this.cargarReserva(this.reserva!.id);
        }
      },
      error: (error: any) => {
        this.mensajeToast = 'Error al cancelar reserva';
        this.mostrarToast = true;
      }
    });
  }

  verFactura() {
    // Navegar a la factura asociada
    this.router.navigate(['/facturas']);
  }

  obtenerColorEstado(estado: string): string {
    const colores: { [key: string]: string } = {
      'pendiente': 'warning',
      'confirmada': 'primary',
      'en-curso': 'success',
      'completada': 'medium',
      'cancelada': 'danger'
    };
    return colores[estado] || 'medium';
  }

  formatearFecha(fecha: Date | string): string {
    return new Date(fecha).toLocaleDateString('es-EC', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  formatearMoneda(monto: number): string {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD'
    }).format(monto);
  }

  getNombreCliente(): string {
    if (this.reserva && typeof this.reserva.cliente === 'object') {
      return `${this.reserva.cliente.nombres} ${this.reserva.cliente.apellidos}`;
    }
    return 'N/A';
  }

  getInfoDepartamento(): string {
    if (this.reserva && typeof this.reserva.departamento === 'object') {
      return `${this.reserva.departamento.numero} - ${this.reserva.departamento.tipo}`;
    }
    return 'N/A';
  }

  puedeHacerCheckIn(): boolean {
    return this.reserva?.estado === 'confirmada' && !this.reserva?.checkIn.realizado;
  }

  puedeHacerCheckOut(): boolean {
    return this.reserva?.estado === 'en-curso' && this.reserva?.checkIn.realizado && !this.reserva?.checkOut.realizado;
  }

  puedeCancelar(): boolean {
    return this.reserva?.estado === 'pendiente' || this.reserva?.estado === 'confirmada';
  }
}
