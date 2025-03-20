import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartStore } from '../../stores/cart.store';
import { CartItemComponent } from '../cart-item/cart-item.component';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartComponent {
  private _cdr = inject(ChangeDetectorRef);
  protected readonly cart = inject(CartStore);

  constructor() {
    effect(() => {
      this.cart.entities();
      this._cdr.detectChanges();
    });
  }
}
