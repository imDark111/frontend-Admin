import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  // {
  //   path: 'register',
  //   loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage)
  // },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.page').then(m => m.DashboardPage),
    canActivate: [AuthGuard],
    data: { requiresAdmin: true }
  },
  {
    path: 'reservas',
    loadComponent: () => import('./pages/reservas/reservas.page').then(m => m.ReservasPage),
    canActivate: [AuthGuard],
    data: { requiresAdmin: true }
  },
  {
    path: 'reservas/crear',
    loadComponent: () => import('./pages/reservas/crear-reserva/crear-reserva.page').then(m => m.CrearReservaPage),
    canActivate: [AuthGuard],
    data: { requiresAdmin: true }
  },
  {
    path: 'reservas/:id',
    loadComponent: () => import('./pages/reservas/detalle-reserva/detalle-reserva.page').then(m => m.DetalleReservaPage),
    canActivate: [AuthGuard],
    data: { requiresAdmin: true }
  },
  {
    path: 'departamentos',
    loadComponent: () => import('./pages/departamentos/departamentos.page').then(m => m.DepartamentosPage),
    canActivate: [AuthGuard],
    data: { requiresAdmin: true }
  },
  {
    path: 'departamentos/crear',
    loadComponent: () => import('./pages/departamentos/crear-departamento/crear-departamento.page').then(m => m.CrearDepartamentoPage),
    canActivate: [AuthGuard],
    data: { requiresAdmin: true }
  },
  {
    path: 'departamentos/:id',
    loadComponent: () => import('./pages/departamentos/crear-departamento/crear-departamento.page').then(m => m.CrearDepartamentoPage),
    canActivate: [AuthGuard],
    data: { requiresAdmin: true }
  },
  {
    path: 'clientes',
    loadComponent: () => import('./pages/clientes/clientes.page').then(m => m.ClientesPage),
    canActivate: [AuthGuard],
    data: { requiresAdmin: true }
  },
  {
    path: 'usuarios',
    loadComponent: () => import('./pages/usuarios/usuarios.page').then(m => m.UsuariosPage),
    canActivate: [AuthGuard],
    data: { requiresAdmin: true }
  },
  {
    path: 'facturas',
    loadComponent: () => import('./pages/facturas/facturas.page').then(m => m.FacturasPage),
    canActivate: [AuthGuard],
    data: { requiresAdmin: true }
  },
  {
    path: 'logs',
    loadComponent: () => import('./pages/logs/logs.page').then(m => m.LogsPage),
    canActivate: [AuthGuard],
    data: { requiresAdmin: true }
  },
  {
    path: 'reportes',
    loadComponent: () => import('./pages/reportes/reportes.page').then(m => m.ReportesPage),
    canActivate: [AuthGuard],
    data: { requiresAdmin: true }
  },
  {
    path: 'perfil',
    loadComponent: () => import('./pages/perfil/perfil.page').then(m => m.PerfilPage),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
