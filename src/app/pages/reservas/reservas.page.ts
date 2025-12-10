import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonBackButton, IonList, IonItem, IonLabel, IonBadge,
  IonSearchbar, IonSelect, IonSelectOption, IonRefresher,
  IonRefresherContent, IonCard, IonCardHeader, IonCardTitle,
  IonCardContent, IonButton, IonIcon, IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, searchOutline, filterOutline, calendarOutline, bedOutline, moonOutline } from 'ionicons/icons';
import { ReservaService } from '../../services/reserva.service';
import { Reserva } from '../../models/interfaces';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.page.html',
  styleUrls: ['./reservas.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
    IonBackButton, IonList, IonBadge,
    IonSearchbar, IonSelect, IonSelectOption, IonRefresher,
    IonRefresherContent, IonCard, IonCardHeader, IonCardTitle,
    IonCardContent, IonButton, IonIcon, IonSpinner
  ]
})
export class ReservasPage implements OnInit {
  reservas: Reserva[] = [];
  reservasFiltradas: Reserva[] = [];
  cargando = false;
  busqueda = '';
  estadoFiltro: string = '';

  constructor(
    private reservaService: ReservaService,
    private router: Router
  ) {
    addIcons({ addOutline, searchOutline, filterOutline, calendarOutline, bedOutline, moonOutline });
  }

  ngOnInit() {
    this.cargarReservas();
  }

  cargarReservas(event?: any) {
    this.cargando = true;
    this.reservaService.obtenerReservas().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.reservas = response.data;
          this.aplicarFiltros();
        }
        this.cargando = false;
        if (event) event.target.complete();
      },
      error: (error) => {
        console.error('Error al cargar reservas:', error);
        this.cargando = false;
        if (event) event.target.complete();
      }
    });
  }

  buscar(event: any) {
    this.busqueda = event.target.value?.toLowerCase() || '';
    this.aplicarFiltros();
  }

  filtrarPorEstado(event: any) {
    this.estadoFiltro = event.target.value;
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    this.reservasFiltradas = this.reservas.filter(reserva => {
      const cumpleBusqueda = !this.busqueda || 
        reserva.codigoReserva.toLowerCase().includes(this.busqueda) ||
        (typeof reserva.cliente === 'object' && 
          (reserva.cliente.nombres + ' ' + reserva.cliente.apellidos).toLowerCase().includes(this.busqueda));
      
      const cumpleEstado = !this.estadoFiltro || reserva.estado === this.estadoFiltro;
      
      return cumpleBusqueda && cumpleEstado;
    });
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

  verDetalle(id: string) {
    this.router.navigate(['/reservas', id]);
  }

  nuevaReserva() {
    this.router.navigate(['/reservas/crear']);
  }

  formatearFecha(fecha: Date | string): string {
    return new Date(fecha).toLocaleDateString('es-EC', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatearMoneda(monto: number): string {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD'
    }).format(monto);
  }

  getNombreCliente(reserva: Reserva): string {
    if (typeof reserva.cliente === 'object') {
      return `${reserva.cliente.nombres} ${reserva.cliente.apellidos}`;
    }
    return 'N/A';
  }

  getNumeroDepartamento(reserva: Reserva): string {
    if (typeof reserva.departamento === 'object') {
      return reserva.departamento.numero;
    }
    return 'N/A';
  }
}
