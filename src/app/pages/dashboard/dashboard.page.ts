import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton,
  IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonGrid, IonRow, IonCol, IonList, IonItem, IonLabel, IonBadge,
  IonMenuButton, IonRefresher, IonRefresherContent, IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  peopleOutline, bedOutline, cashOutline, statsChartOutline,
  calendarOutline, logOutOutline, arrowUpOutline, arrowDownOutline,
  checkmarkCircleOutline, alertCircleOutline
} from 'ionicons/icons';
import { DashboardService } from '../../services/dashboard.service';
import { AuthService } from '../../services/auth.service';
import { DashboardEstadisticas, Reserva } from '../../models/interfaces';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton,
    IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonGrid, IonRow, IonCol, IonList, IonItem, IonLabel, IonBadge,
    IonMenuButton, IonRefresher, IonRefresherContent, IonSpinner
  ]
})
export class DashboardPage implements OnInit {
  estadisticas: DashboardEstadisticas | null = null;
  checkInsHoy: Reserva[] = [];
  checkOutsHoy: Reserva[] = [];
  todosCheckIns: Reserva[] = [];
  todosCheckOuts: Reserva[] = [];
  mostrarTodos = true;
  loading = true;

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({
      peopleOutline, bedOutline, cashOutline, statsChartOutline,
      calendarOutline, logOutOutline, arrowUpOutline, arrowDownOutline,
      checkmarkCircleOutline, alertCircleOutline
    });
  }

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.loading = true;
    
    // Cargar estadísticas
    this.dashboardService.obtenerEstadisticas().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.estadisticas = response.data;
        }
      },
      error: (error) => console.error('Error al cargar estadísticas', error)
    });

    // Cargar check-ins de hoy
    this.dashboardService.obtenerCheckInsHoy().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.checkInsHoy = response.data;
        }
      },
      error: (error) => console.error('Error al cargar check-ins', error)
    });

    // Cargar check-outs de hoy
    this.dashboardService.obtenerCheckOutsHoy().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.checkOutsHoy = response.data;
        }
      },
      error: (error) => console.error('Error al cargar check-outs', error)
    });

    // Cargar todos los check-ins
    this.dashboardService.obtenerTodosCheckIns().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.todosCheckIns = response.data;
        }
      },
      error: (error) => console.error('Error al cargar todos los check-ins', error)
    });

    // Cargar todos los check-outs
    this.dashboardService.obtenerTodosCheckOuts().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.todosCheckOuts = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar todos los check-outs', error);
        this.loading = false;
      }
    });
  }

  handleRefresh(event: any) {
    this.cargarDatos();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  formatearMoneda(valor: number): string {
    return `$${valor.toFixed(2)}`;
  }

  formatearFecha(fecha: Date | undefined): string {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-EC', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getNumeroDepartamento(reserva: Reserva): string {
    if (typeof reserva.departamento === 'object' && reserva.departamento !== null) {
      return (reserva.departamento as any).numero || 'N/A';
    }
    return 'N/A';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navegarA(ruta: string) {
    this.router.navigate([ruta]);
  }
}
