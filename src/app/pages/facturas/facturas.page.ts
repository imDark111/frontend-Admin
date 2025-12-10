import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonBackButton, IonList, IonCard, IonCardHeader, IonCardTitle,
  IonCardContent, IonItem, IonLabel, IonBadge, IonIcon,
  IonRefresher, IonRefresherContent, IonSpinner, IonButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { documentsOutline, cashOutline, refreshOutline } from 'ionicons/icons';
import { FacturaService } from '../../services/factura.service';
import { Factura } from '../../models/interfaces';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.page.html',
  styleUrls: ['./facturas.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
    IonBackButton, IonList, IonCard, IonCardHeader, IonCardTitle,
    IonCardContent, IonItem, IonLabel, IonBadge, IonIcon,
    IonRefresher, IonRefresherContent, IonSpinner, IonButton
  ]
})
export class FacturasPage implements OnInit {
  facturas: Factura[] = [];
  cargando = false;

  constructor(private facturaService: FacturaService) {
    addIcons({ documentsOutline, cashOutline, refreshOutline });
  }

  ngOnInit() {
    this.cargarFacturas();
  }

  cargarFacturas(event?: any) {
    this.cargando = true;
    this.facturaService.obtenerFacturas().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.facturas = response.data;
        }
        this.cargando = false;
        if (event) event.target.complete();
      },
      error: (error: any) => {
        console.error('Error:', error);
        this.cargando = false;
        if (event) event.target.complete();
      }
    });
  }

  obtenerColorEstado(estado: string): string {
    const colores: { [key: string]: string } = {
      'pendiente': 'warning',
      'pagada': 'success',
      'parcial': 'tertiary',
      'anulada': 'danger'
    };
    return colores[estado] || 'medium';
  }

  formatearFecha(fecha: Date | string): string {
    return new Date(fecha).toLocaleDateString('es-EC');
  }

  formatearMoneda(monto: number): string {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD'
    }).format(monto);
  }

  autoGenerarFacturas() {
    this.cargando = true;
    this.facturaService.autoGenerarFacturas().subscribe({
      next: (response: any) => {
        console.log('Facturas generadas:', response);
        alert(`${response.message}`);
        this.cargarFacturas();
      },
      error: (error: any) => {
        console.error('Error:', error);
        alert('Error al generar facturas');
        this.cargando = false;
      }
    });
  }
}
