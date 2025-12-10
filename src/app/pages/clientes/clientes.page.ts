import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonBackButton, IonList, IonItem, IonLabel, IonBadge,
  IonSearchbar, IonRefresher, IonRefresherContent,
  IonCard, IonButton, IonIcon, IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, mailOutline, callOutline, starOutline } from 'ionicons/icons';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models/interfaces';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
    IonBackButton, IonList, IonItem, IonLabel, IonBadge,
    IonSearchbar, IonRefresher, IonRefresherContent,
    IonCard, IonIcon, IonSpinner
  ]
})
export class ClientesPage implements OnInit {
  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  cargando = false;
  busqueda = '';

  constructor(
    private clienteService: ClienteService,
    private router: Router
  ) {
    addIcons({ personOutline, mailOutline, callOutline, starOutline });
  }

  ngOnInit() {
    this.cargarClientes();
  }

  cargarClientes(event?: any) {
    this.cargando = true;
    this.clienteService.obtenerClientes().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.clientes = response.data;
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

  buscar(event: any) {
    this.busqueda = event.target.value?.toLowerCase() || '';
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    this.clientesFiltrados = this.clientes.filter(cliente => {
      return !this.busqueda || 
        cliente.nombres.toLowerCase().includes(this.busqueda) ||
        cliente.apellidos.toLowerCase().includes(this.busqueda) ||
        cliente.cedula.includes(this.busqueda) ||
        cliente.email.toLowerCase().includes(this.busqueda);
    });
  }

  getNombreCompleto(cliente: Cliente): string {
    return `${cliente.nombres} ${cliente.apellidos}`;
  }
}
