import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonBackButton, IonList, IonItem, IonLabel, IonBadge,
  IonSearchbar, IonSelect, IonSelectOption, IonRefresher,
  IonRefresherContent, IonCard, IonSpinner, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { shieldCheckmarkOutline } from 'ionicons/icons';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/interfaces';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
    IonBackButton, IonList, IonItem, IonLabel, IonBadge,
    IonSearchbar, IonRefresher,
    IonRefresherContent, IonCard, IonSpinner, IonIcon
  ]
})
export class UsuariosPage implements OnInit {
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  cargando = false;
  busqueda = '';

  constructor(private usuarioService: UsuarioService) {
    addIcons({ shieldCheckmarkOutline });
  }

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios(event?: any) {
    this.cargando = true;
    this.usuarioService.obtenerUsuarios().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.usuarios = response.data;
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
    this.usuariosFiltrados = this.usuarios.filter(usuario => {
      return !this.busqueda || 
        usuario.nombreUsuario.toLowerCase().includes(this.busqueda) ||
        usuario.email.toLowerCase().includes(this.busqueda);
    });
  }

  obtenerColorRol(rol: string): string {
    return rol === 'admin' ? 'danger' : 'primary';
  }
}
