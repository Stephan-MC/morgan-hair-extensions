import { CurrencyPipe, PercentPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  NO_ERRORS_SCHEMA,
  output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartStore } from '../../stores/cart.store';
import { DiscountType } from '../../types/discount';
import { Product } from '../../types/product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'web-product-card',
  imports: [CurrencyPipe, PercentPipe, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
  host: {
    '[class.group/product-card]': 'true',
    '[class.out]': 'product().stock <= 0',
    '[class.new]': 'product().new',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [NO_ERRORS_SCHEMA],
})
export class ProductCardComponent {
  private _productService = inject(ProductService);
  readonly cart = inject(CartStore);
  product = input.required<Product>();
  like = output<boolean>();

  hasDiscount() {
    return this.product().discounts.length > 0 && this.activeDiscount();
  }

  activeDiscount() {
    return this.product().discounts.find((discount) => discount.is_active);
  }

  discountedPrice() {
    if (this.activeDiscount() == undefined) return this.product().price;

    if (this.activeDiscount()!.type === DiscountType.PERCENTAGE) {
      return (
        ((100 - this.activeDiscount()!.value) * this.product().price) / 100
      );
    } else {
      return this.product().price - this.activeDiscount()!.value;
    }
  }

  likeProduct() {
    Promise.all([
      this.product().liked
        ? this._productService.unlike(this.product().id)
        : this._productService.like(this.product().id),
      this.like.emit(!this.product().liked),
    ]);
  }
}
