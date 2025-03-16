import { CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductHelper } from '../../helpers/product.helper';
import { CartProduct, CartStore } from '../../stores/cart.store';
import { getState } from '@ngrx/signals';

@Component({
  selector: 'web-cart-item',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartItemComponent {
  private _cdr = inject(ChangeDetectorRef);
  product = input.required<CartProduct>();
  cart = inject(CartStore);
  protected productHelper!: ProductHelper;

  constructor() {
    effect(() => {
      this.cart.productsEntities();
      this._cdr.markForCheck();
    });
  }

  ngOnInit() {
    this.productHelper = new ProductHelper(this.product());
  }

  calculateInputWidth() {
    return Math.ceil(
      this.product().quantity.toString().length * (4 * 3) + 4 * 6,
    );
  }

  increment() {
    this.cart.add({
      ...this.product(),
      price: this.productHelper.discountedPrice(),
    });
  }

  reduce() {
    this.cart.reduce({
      ...this.product(),
      price: this.productHelper.discountedPrice(),
    });
  }
}
