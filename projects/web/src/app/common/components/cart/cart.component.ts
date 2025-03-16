import { CurrencyPipe } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { CartProduct, CartStore } from '../../stores/cart.store';
import { CartItemComponent } from '../cart-item/cart-item.component';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { RouterLink } from '@angular/router';
import { getState } from '@ngrx/signals';

@Component({
  selector: 'web-cart',
  imports: [CurrencyPipe, RouterLink, CartItemComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          right: 0,
          opacity: 1,
        }),
      ),
      state('close', style({ opacity: 0, right: '*' })),
      transition('open <=> close', animate('.5s linear')),
      transition('close => open', animate('.2s linear')),
    ]),
  ],
  host: {
    '[@openClose]': 'cart.show() ? "open" : "close"',
  },
})
export class CartComponent {
  protected readonly cart = inject(CartStore);
}
