import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./messages/messages').then((m) => m.Messages),
  },
];
