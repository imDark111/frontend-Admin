import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonBackButton, IonList, IonItem, IonInput,
  IonSelect, IonSelectOption, IonTextarea, IonButton,
  IonSpinner, IonIcon, IonCheckbox
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { saveOutline, closeOutline, addOutline, trashOutline } from 'ionicons/icons';
import { DepartamentoService } from '../../../services/departamento.service';

// Registrar íconos globalmente
addIcons({ saveOutline, closeOutline, addOutline, trashOutline });

@Component({
  selector: 'app-crear-departamento',
  templateUrl: './crear-departamento.page.html',
  styleUrls: ['./crear-departamento.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
    IonBackButton, IonList, IonItem, IonInput,
    IonSelect, IonSelectOption, IonTextarea, IonButton,
    IonSpinner, IonIcon, IonCheckbox
  ]
})
export class CrearDepartamentoPage implements OnInit {
  guardando = false;
  cargando = false;
  esEdicion = false;
  departamentoId: string | null = null;
  nuevaImagenUrl = '';
  nuevaImagenDesc = '';

  formulario = {
    numero: '',
    tipo: 'doble',
    descripcion: '',
    piso: 1,
    precioNoche: 0,
    capacidadPersonas: 1,
    numeroCamas: 1,
    tipoCamas: 'matrimonial',
    caracteristicas: {
      televisor: false,
      wifi: true,
      aireAcondicionado: false,
      calefaccion: false,
      minibar: false,
      cajaFuerte: false,
      balcon: false,
      vistaAlMar: false,
      banoPrivado: true,
      jacuzzi: false,
      cocina: false,
      escritorio: false,
      secadorPelo: false,
      plancha: false,
      telefono: false
    },
    imagenes: [] as Array<{url: string, descripcion?: string}>,
    estado: 'disponible',
    observaciones: ''
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private departamentoService: DepartamentoService
  ) { }

  ngOnInit() {
    this.departamentoId = this.route.snapshot.paramMap.get('id');
    if (this.departamentoId) {
      this.esEdicion = true;
      this.cargarDepartamento();
    }
  }

  cargarDepartamento() {
    if (!this.departamentoId) return;
    
    this.cargando = true;
    this.departamentoService.obtenerDepartamento(this.departamentoId).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          const depto = response.data;
          
          // Cargar datos básicos
          this.formulario.numero = depto.numero;
          this.formulario.tipo = depto.tipo;
          this.formulario.descripcion = depto.descripcion || '';
          this.formulario.piso = depto.piso;
          this.formulario.precioNoche = depto.precioNoche;
          this.formulario.capacidadPersonas = depto.capacidadPersonas;
          this.formulario.numeroCamas = depto.numeroCamas;
          this.formulario.tipoCamas = depto.tipoCamas;
          this.formulario.estado = depto.estado;
          this.formulario.observaciones = depto.observaciones || '';
          
          // Cargar características (merge con valores existentes)
          if (depto.caracteristicas) {
            this.formulario.caracteristicas = {
              ...this.formulario.caracteristicas,
              ...depto.caracteristicas
            };
          }
          
          // Cargar imágenes
          this.formulario.imagenes = depto.imagenes || [];
          
          console.log('Departamento cargado:', this.formulario);
          console.log('Características:', this.formulario.caracteristicas);
          console.log('Imágenes:', this.formulario.imagenes);
        }
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar departamento:', error);
        this.cargando = false;
      }
    });
  }

  agregarImagen() {
    const urlTrimmed = this.nuevaImagenUrl.trim();
    if (urlTrimmed) {
      const nuevaImagen: { url: string; descripcion?: string } = {
        url: urlTrimmed
      };
      
      const descTrimmed = this.nuevaImagenDesc.trim();
      if (descTrimmed) {
        nuevaImagen.descripcion = descTrimmed;
      }
      
      this.formulario.imagenes.push(nuevaImagen);
      console.log('✅ Imagen agregada:', nuevaImagen);
      console.log('📋 Total de imágenes:', this.formulario.imagenes.length);
      console.log('🖼️ Imágenes completas:', JSON.stringify(this.formulario.imagenes, null, 2));
      
      this.nuevaImagenUrl = '';
      this.nuevaImagenDesc = '';
    } else {
      console.warn('⚠️ URL de imagen vacía');
    }
  }

  eliminarImagen(index: number) {
    console.log('🗑️ Eliminando imagen en índice:', index);
    console.log('📋 Imágenes antes:', this.formulario.imagenes.length);
    
    if (index >= 0 && index < this.formulario.imagenes.length) {
      this.formulario.imagenes.splice(index, 1);
      console.log('✅ Imagen eliminada');
      console.log('📋 Imágenes después:', this.formulario.imagenes.length);
    } else {
      console.error('❌ Índice inválido:', index);
    }
  }

  validarFormulario(): boolean {
    return !!(
      this.formulario.numero &&
      this.formulario.tipo &&
      this.formulario.piso > 0 &&
      this.formulario.capacidadPersonas > 0 &&
      this.formulario.numeroCamas > 0 &&
      this.formulario.precioNoche > 0
    );
  }

  guardarDepartamento() {
    if (!this.validarFormulario()) {
      console.warn('⚠️ Formulario no válido');
      return;
    }

    console.log('💾 Guardando departamento...');
    console.log('📋 Datos completos:', JSON.stringify(this.formulario, null, 2));
    console.log('🖼️ Imágenes:', this.formulario.imagenes);
    console.log('✨ Características:', this.formulario.caracteristicas);

    this.guardando = true;
    
    console.log('📤 Datos a enviar:', JSON.stringify(this.formulario, null, 2));
    
    const operacion = this.esEdicion && this.departamentoId
      ? this.departamentoService.actualizarDepartamento(this.departamentoId, this.formulario as any)
      : this.departamentoService.crearDepartamento(this.formulario);

    operacion.subscribe({
      next: (response: any) => {
        console.log('✅ Respuesta del servidor:', response);
        if (response.success) {
          console.log('✅ Departamento guardado exitosamente');
          this.router.navigate(['/departamentos']);
        }
        this.guardando = false;
      },
      error: (error) => {
        console.error('❌ Error al guardar departamento:', error);
        console.error('Detalles del error:', error.error);
        this.guardando = false;
      }
    });
  }

  cancelar() {
    this.router.navigate(['/departamentos']);
  }

  // Método de depuración para ver el estado de las características
  verEstadoCaracteristicas() {
    console.log('🔍 Estado actual de características:', this.formulario.caracteristicas);
  }
}
