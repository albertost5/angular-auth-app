import { Routes } from '@angular/router';
import {isAuthenticatedGuard, isNotAuthenticatedGuard} from './auth/guards';


export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [isNotAuthenticatedGuard],
    loadChildren: () => import('./auth/auth.routes').then(m => m.default),
  },
  {
    path: 'dashboard',
    canActivate: [isAuthenticatedGuard],
    loadChildren: () => import('./dashboard/dashboard.routes').then(m => m.default),
  },
  {
    path: '**',
    redirectTo: 'auth'
  }
];
