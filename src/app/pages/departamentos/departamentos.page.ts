import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonBackButton, IonGrid, IonRow, IonCol, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent, IonButton, IonIcon, IonBadge,
  IonSearchbar, IonSelect, IonSelectOption, IonRefresher,
  IonRefresherContent, IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, bedOutline, cashOutline, peopleOutline } from 'ionicons/icons';
import { DepartamentoService } from '../../services/departamento.service';
import { Departamento } from '../../models/interfaces';

@Component({
  selector: 'app-departamentos',
  templateUrl: './departamentos.page.html',
  styleUrls: ['./departamentos.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
    IonBackButton, IonGrid, IonRow, IonCol, IonCard, IonCardHeader,
    IonCardTitle, IonCardContent, IonButton, IonIcon, IonBadge,
    IonSearchbar, IonRefresher,
    IonRefresherContent, IonSpinner
  ]
})
export class DepartamentosPage implements OnInit {
  departamentos: Departamento[] = [];
  departamentosFiltrados: Departamento[] = [];
  cargando = false;
  busqueda = '';
  estadoFiltro = '';
  tipoFiltro = '';

  constructor(
    private departamentoService: DepartamentoService,
    private router: Router
  ) {
    addIcons({ addOutline, bedOutline, cashOutline, peopleOutline });
  }

  ngOnInit() {
    this.cargarDepartamentos();
  }

  ionViewWillEnter() {
    // Se ejecuta cada vez que entras a esta página
    this.cargarDepartamentos();
  }

  cargarDepartamentos(event?: any) {
    this.cargando = true;
    this.departamentoService.obtenerDepartamentos().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          console.log('📦 Departamentos cargados:', response.data.length);
          response.data.forEach((depto: any) => {
            console.log(`Depto ${depto.numero}: ${depto.imagenes?.length || 0} imagen(es)`, depto.imagenes);
          });
          this.departamentos = response.data;
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

  aplicarFiltros() {
    this.departamentosFiltrados = this.departamentos.filter(depto => {
      const cumpleBusqueda = !this.busqueda || 
        depto.numero.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        depto.tipo.toLowerCase().includes(this.busqueda.toLowerCase());
      const cumpleEstado = !this.estadoFiltro || depto.estado === this.estadoFiltro;
      const cumpleTipo = !this.tipoFiltro || depto.tipo === this.tipoFiltro;
      return cumpleBusqueda && cumpleEstado && cumpleTipo;
    });
  }

  buscar(event: any) {
    this.busqueda = event.target.value || '';
    this.aplicarFiltros();
  }

  verDetalle(departamento: any) {
    const id = departamento._id || departamento.id;
    if (id) {
      this.router.navigate(['/departamentos', id]);
    }
  }

  nuevo() {
    this.router.navigate(['/departamentos/crear']);
  }

  editar(departamento: any, event: Event) {
    event.stopPropagation(); // Evitar que se active el click del card
    const id = departamento._id || departamento.id;
    if (id) {
      this.router.navigate(['/departamentos', id]);
    }
  }

  obtenerColorEstado(estado: string): string {
    const colores: { [key: string]: string } = {
      'disponible': 'success',
      'ocupado': 'danger',
      'mantenimiento': 'warning',
      'reservado': 'primary'
    };
    return colores[estado] || 'medium';
  }

  formatearMoneda(monto: number): string {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD'
    }).format(monto);
  }

  getImagenPrincipal(depto: Departamento): string {
    console.log(`🖼️ Obteniendo imagen para Depto ${depto.numero}:`, depto.imagenes);
    
    if (depto.imagenes && depto.imagenes.length > 0) {
      console.log(`  📋 Tiene ${depto.imagenes.length} imagen(es)`);
      
      // Buscar la primera URL válida (que empiece con http:// o https://)
      const imagenValida = depto.imagenes.find(img => {
        const esValida = img.url && (img.url.startsWith('http://') || img.url.startsWith('https://'));
        console.log(`  🔍 URL: ${img.url?.substring(0, 50)}... - Válida: ${esValida}`);
        return esValida;
      });
      
      if (imagenValida) {
        console.log(`  ✅ Usando imagen: ${imagenValida.url}`);
        return imagenValida.url;
      } else {
        console.log(`  ⚠️ No se encontró ninguna URL válida`);
      }
    } else {
      console.log(`  ❌ No tiene imágenes`);
    }
    
    const placeholder = 'https://placehold.co/400x300/4a90e2/ffffff?text=Depto+' + depto.numero;
    console.log(`  🔷 Usando placeholder: ${placeholder}`);
    return placeholder;
  }

  onImageError(event: any) {
    console.error('Error cargando imagen:', event.target.src);
    event.target.src = 'https://placehold.co/400x300/cccccc/666666?text=Sin+Imagen';
  }
}
