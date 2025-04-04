import { Component, inject } from '@angular/core';
import { CartStore } from '../common/stores/cart.store';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ImageComponent } from 'shared';

@Component({
  selector: 'web-cart',
  imports: [CurrencyPipe, RouterLink, ImageComponent],
  templateUrl: './cart.page.html',
  styleUrl: './cart.page.css',
})
export class CartPage {
  cart = inject(CartStore);
}
