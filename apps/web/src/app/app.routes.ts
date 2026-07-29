import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home').then(m => m.HomeComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.LoginComponent),
  },
  {
    path: 'recargar',
    loadComponent: () =>
      import('./pages/home/home').then(m => m.HomeComponent), // placeholder
  },
  {
    path: 'lineas-virtuales',
    loadComponent: () =>
      import('./pages/home/home').then(m => m.HomeComponent), // placeholder
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent),
  },
  {
    path: 'historial',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '',
  },
];