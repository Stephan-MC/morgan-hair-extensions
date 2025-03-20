import { CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  input,
  linkedSignal,
  output,
  SimpleChanges,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductHelper } from '../../helpers/product.helper';
import { CartItem, CartStore } from '../../stores/cart.store';

@Component({
  selector: 'web-cart-item',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartItemComponent {
  private _cdr = inject(ChangeDetectorRef);
  product = input.required<CartItem>();
  increment = output();
  decrement = output();
  remove = output();
  private __oldProduct!: CartItem;
  protected productHelper!: ProductHelper;

  ngOnInit() {
    this.productHelper = new ProductHelper(this.product());
  }

  ngDoCheck() {
    if (this.__oldProduct?.quantity != this.product().quantity) {
      this._cdr.detectChanges();

      this.__oldProduct = { ...this.product() };
    }
  }

  calculateInputWidth() {
    return Math.ceil(
      this.product().quantity.toString().length * (4 * 3) + 4 * 6,
    );
  }
}
