import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'wigs',
    loadComponent: () => import('./wigs/wigs.page').then((m) => m.WigsPage),
  },
  {
    path: 'wig/:slug',
    title: 'Update wig',
    loadComponent: () => import('./wig/wig.page').then((m) => m.WigPage),
  },
  {
    path: 'wig',
    title: 'Add wig',
    loadComponent: () => import('./wig/wig.page').then((m) => m.WigPage),
  },
];
