import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonBackButton, IonList, IonCard, IonItem, IonLabel,
  IonBadge, IonIcon, IonRefresher, IonRefresherContent,
  IonSpinner, IonSelect, IonSelectOption
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { fingerPrintOutline } from 'ionicons/icons';
import { LogService } from '../../services/log.service';
import { Log } from '../../models/interfaces';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.page.html',
  styleUrls: ['./logs.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
    IonBackButton, IonList, IonCard, IonItem, IonLabel,
    IonBadge, IonIcon, IonRefresher, IonRefresherContent,
    IonSpinner, IonSelect, IonSelectOption
  ]
})
export class LogsPage implements OnInit {
  logs: Log[] = [];
  logsFiltrados: Log[] = [];
  cargando = false;
  accionFiltro = '';

  constructor(private logService: LogService) {
    addIcons({ fingerPrintOutline });
  }

  ngOnInit() {
    this.cargarLogs();
  }

  cargarLogs(event?: any) {
    this.cargando = true;
    this.logService.obtenerLogs().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.logs = response.data;
          this.aplicarFiltros();
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

  filtrarPorAccion(event: any) {
    this.accionFiltro = event.target.value;
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    this.logsFiltrados = this.logs.filter(log => {
      return !this.accionFiltro || log.accion === this.accionFiltro;
    });
  }

  obtenerColorAccion(accion: string): string {
    const colores: { [key: string]: string } = {
      'CREATE': 'success',
      'READ': 'primary',
      'UPDATE': 'warning',
      'DELETE': 'danger',
      'LOGIN': 'tertiary',
      'LOGOUT': 'medium',
      'LOGIN_FAILED': 'danger',
      'REGISTER': 'success'
    };
    return colores[accion] || 'medium';
  }

  formatearFecha(fecha: Date | string): string {
    return new Date(fecha).toLocaleString('es-EC');
  }

  getUsuarioNombre(log: Log): string {
    if (typeof log.usuario === 'object' && log.usuario) {
      return log.usuario.nombreUsuario;
    }
    return 'Sistema';
  }
}
