import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonBackButton, IonList, IonItem, IonLabel,
  IonSelect, IonSelectOption, IonTextarea, IonButton,
  IonDatetime, IonDatetimeButton, IonModal, IonSpinner, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { saveOutline, closeOutline } from 'ionicons/icons';
import { ReservaService } from '../../../services/reserva.service';
import { ClienteService } from '../../../services/cliente.service';
import { DepartamentoService } from '../../../services/departamento.service';
import { Cliente, Departamento } from '../../../models/interfaces';

@Component({
  selector: 'app-crear-reserva',
  templateUrl: './crear-reserva.page.html',
  styleUrls: ['./crear-reserva.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
    IonBackButton, IonList, IonItem, IonLabel,
    IonSelect, IonSelectOption, IonTextarea, IonButton,
    IonDatetime, IonDatetimeButton, IonModal, IonSpinner, IonIcon
  ]
})
export class CrearReservaPage implements OnInit {
  clientes: Cliente[] = [];
  departamentos: Departamento[] = [];
  cargando = false;
  guardando = false;
  minDate = new Date().toISOString();

  formulario = {
    clienteId: '',
    departamentoId: '',
    fechaInicio: '',
    fechaFin: '',
    observaciones: ''
  };

  constructor(
    private router: Router,
    private reservaService: ReservaService,
    private clienteService: ClienteService,
    private departamentoService: DepartamentoService
  ) {
    addIcons({ saveOutline, closeOutline });
  }

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando = true;
    
    // Cargar clientes
    this.clienteService.obtenerClientes().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.clientes = response.data;
        }
      },
      error: (error) => console.error('Error al cargar clientes:', error)
    });

    // Cargar departamentos disponibles
    this.departamentoService.obtenerDepartamentos('disponible').subscribe({
      next: (response: any) => {
        if (response.success) {
          this.departamentos = response.data;
        }
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar departamentos:', error);
        this.cargando = false;
      }
    });
  }

  calcularNoches(): number {
    if (this.formulario.fechaInicio && this.formulario.fechaFin) {
      const inicio = new Date(this.formulario.fechaInicio);
      const fin = new Date(this.formulario.fechaFin);
      const diff = fin.getTime() - inicio.getTime();
      return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }
    return 0;
  }

  calcularTotal(): number {
    const departamento = this.departamentos.find(d => d.id === this.formulario.departamentoId);
    if (departamento) {
      return this.calcularNoches() * departamento.precioNoche;
    }
    return 0;
  }

  validarFormulario(): boolean {
    return !!(
      this.formulario.clienteId &&
      this.formulario.departamentoId &&
      this.formulario.fechaInicio &&
      this.formulario.fechaFin &&
      this.calcularNoches() > 0
    );
  }

  guardarReserva() {
    if (!this.validarFormulario()) {
      return;
    }

    this.guardando = true;
    this.reservaService.crearReserva(this.formulario).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.router.navigate(['/reservas']);
        }
        this.guardando = false;
      },
      error: (error) => {
        console.error('Error al crear reserva:', error);
        this.guardando = false;
      }
    });
  }

  cancelar() {
    this.router.navigate(['/reservas']);
  }
}
