import { Component, inject } from '@angular/core';
import { CartStore } from '../common/stores/cart.store';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'web-cart',
  imports: [CurrencyPipe, NgOptimizedImage, RouterLink],
  templateUrl: './cart.page.html',
  styleUrl: './cart.page.css',
})
export class CartPage {
  cart = inject(CartStore);
}
