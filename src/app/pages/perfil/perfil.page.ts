import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonBackButton, IonCard, IonCardHeader, IonCardTitle,
  IonCardContent, IonList, IonItem, IonLabel, IonInput,
  IonButton, IonIcon, IonAvatar, IonToggle, IonToast
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, mailOutline, cameraOutline, keyOutline, shieldCheckmarkOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/interfaces';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
    IonBackButton, IonCard, IonCardHeader, IonCardTitle,
    IonCardContent, IonList, IonItem, IonLabel, IonInput,
    IonButton, IonIcon, IonAvatar, IonToggle, IonToast
  ]
})
export class PerfilPage implements OnInit {
  usuario: Usuario | null = null;
  editando = false;
  cambiarPassword = false;
  passwordData = {
    passwordActual: '',
    passwordNueva: '',
    confirmarPassword: ''
  };
  mostrarToast = false;
  mensajeToast = '';

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService
  ) {
    addIcons({ personOutline, mailOutline, cameraOutline, keyOutline, shieldCheckmarkOutline });
  }

  ngOnInit() {
    this.authService.currentUser.subscribe((user: Usuario | null) => {
      this.usuario = user;
    });
  }

  cambiarFoto(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log('📸 Archivo seleccionado:', file.name, file.type, file.size);
      
      const formData = new FormData();
      formData.append('fotoPerfil', file);
      
      this.usuarioService.cambiarFoto(formData).subscribe({
        next: (response: any) => {
          console.log('✅ Respuesta del servidor:', response);
          if (response.success) {
            this.mensajeToast = 'Foto actualizada exitosamente';
            this.mostrarToast = true;
            
            // Actualizar la foto en el objeto usuario actual
            if (this.usuario && response.data && response.data.fotoPerfil) {
              const nuevaFoto = response.data.fotoPerfil;
              console.log('🖼️ Nueva foto URL:', nuevaFoto);
              
              // Forzar recarga con timestamp para evitar caché
              this.usuario.fotoPerfil = nuevaFoto + '?t=' + new Date().getTime();
              
              // Actualizar en el servicio de autenticación
              this.authService.actualizarFotoPerfil(nuevaFoto);
            }
          }
        },
        error: (error: any) => {
          console.error('❌ Error al actualizar foto:', error);
          this.mensajeToast = error.error?.message || 'Error al actualizar foto';
          this.mostrarToast = true;
        }
      });
    }
  }

  guardarCambios() {
    if (!this.usuario) return;
    
    this.usuarioService.actualizarUsuario(this.usuario.id, this.usuario).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.mensajeToast = 'Perfil actualizado exitosamente';
          this.mostrarToast = true;
          this.editando = false;
        }
      },
      error: (error: any) => {
        this.mensajeToast = 'Error al actualizar perfil';
        this.mostrarToast = true;
      }
    });
  }

  guardarPassword() {
    if (this.passwordData.passwordNueva !== this.passwordData.confirmarPassword) {
      this.mensajeToast = 'Las contraseñas no coinciden';
      this.mostrarToast = true;
      return;
    }

    this.usuarioService.cambiarPassword({
      passwordActual: this.passwordData.passwordActual,
      passwordNueva: this.passwordData.passwordNueva
    }).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.mensajeToast = 'Contraseña actualizada exitosamente';
          this.mostrarToast = true;
          this.cambiarPassword = false;
          this.passwordData = { passwordActual: '', passwordNueva: '', confirmarPassword: '' };
        }
      },
      error: (error: any) => {
        this.mensajeToast = 'Error al cambiar contraseña';
        this.mostrarToast = true;
      }
    });
  }

  toggle2FA() {
    // Implementar lógica de 2FA
    this.mensajeToast = 'Funcionalidad 2FA en desarrollo';
    this.mostrarToast = true;
  }

  getUrlFoto(): string {
    if (!this.usuario?.fotoPerfil) {
      // Usar un avatar generado por defecto
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.usuario?.nombreUsuario || 'User')}&background=1b5e20&color=fff&size=200`;
    }
    
    const foto = this.usuario.fotoPerfil;
    
    // Si ya tiene la URL completa, devolverla
    if (foto.startsWith('http://') || foto.startsWith('https://')) {
      return foto;
    }
    
    // Si es ruta relativa, construir URL completa
    const apiUrl = 'http://192.168.0.11:3000';
    return `${apiUrl}${foto.startsWith('/') ? foto : '/' + foto}`;
  }
}
