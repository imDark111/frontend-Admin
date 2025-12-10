import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonButton,
  IonIcon, IonText, IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader,
    IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonButton,
    IonIcon, IonText, IonSpinner
  ]
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  loading: boolean = false;
  errorMessage: string = '';
  requires2FA: boolean = false;
  userId: string = '';
  code2FA: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({ mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline });
  }

  ngOnInit() {
    // Si ya está autenticado, redirigir al dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor complete todos los campos';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login({ email: this.email, password: this.password })
      .subscribe({
        next: (response) => {
          this.loading = false;
          if (response.requiresTwoFactor) {
            this.requires2FA = true;
            this.userId = response.userId || '';
          } else if (response.success && response.data) {
            // Verificar que sea admin
            if (response.data.usuario.rol !== 'admin') {
              this.errorMessage = 'Este panel es solo para administradores';
              this.authService.logout();
              return;
            }
            this.router.navigate(['/dashboard']);
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Error al iniciar sesión';
        }
      });
  }

  verify2FA() {
    if (!this.code2FA) {
      this.errorMessage = 'Por favor ingrese el código 2FA';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.verify2FA(this.userId, this.code2FA)
      .subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success && response.data) {
            if (response.data.usuario.rol !== 'admin') {
              this.errorMessage = 'Este panel es solo para administradores';
              this.authService.logout();
              return;
            }
            this.router.navigate(['/dashboard']);
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Código 2FA inválido';
        }
      });
  }
}
