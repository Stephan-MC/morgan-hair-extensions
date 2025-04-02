import { CurrencyPipe, NgOptimizedImage, PercentPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  NO_ERRORS_SCHEMA,
  output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductHelper } from '../../helpers/product.helper';
import { ProductService } from '../../services/product.service';
import { CartStore } from '../../stores/cart.store';
import { Product } from 'shared';

@Component({
  selector: 'web-product-card',
  imports: [CurrencyPipe, NgOptimizedImage, PercentPipe, RouterLink],
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
  thumbnailLoadingPriority = input<boolean>(false);
  like = output<boolean>();
  productHelper!: ProductHelper;

  ngOnInit() {
    this.productHelper = new ProductHelper(this.product());
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
