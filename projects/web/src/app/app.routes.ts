import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'shop',
    loadComponent: () => import('./shop/shop.page').then((m) => m.ShopPage),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./contact/contact.page').then((m) => m.ContactPage),
  },
  {
    path: 'about',
    loadComponent: () => import('./about/about.page').then((m) => m.AboutPage),
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./checkout/checkout.page').then((m) => m.CheckoutPage),
  },
  {
    path: 'cart',
    loadComponent: () => import('./cart/cart.page').then((m) => m.CartPage),
  },
];
