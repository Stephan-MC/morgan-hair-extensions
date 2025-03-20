import { Component, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductCardSkeletonComponent } from '../common/components/product-card-skeleton/product-card-skeleton.component';
import { ProductCardComponent } from '../common/components/product-card/product-card.component';
import { ShopFilterComponent } from '../common/components/shop-filter/shop-filter.component';
import { WigCardComponent } from '../common/components/wig-card/wig-card.component';
import { WigService } from '../common/services/wig.service';
import { CartStore } from '../common/stores/cart.store';
import { PaginationComponent } from '../common/components/pagination/pagination.component';
import { WigFilter } from '../common/types/wig';

@Component({
  selector: 'web-shop',
  imports: [
    FormsModule,
    PaginationComponent,
    ProductCardSkeletonComponent,
    ShopFilterComponent,
    WigCardComponent,
  ],
  templateUrl: './shop.page.html',
  styleUrl: './shop.page.css',
  host: {
    '[class.mt-12]': 'true',
  },
})
export class ShopPage {
  private _wigService = inject(WigService);
  wigs = this._wigService.wigsResource;
  cart = inject(CartStore);
  filterOpen = signal(false);

  page = input<number>();

  constructor() {
    effect(() => {
      if (this.page()) {
        this.patchFilters({ page: this.page() });
      }
    });
  }

  hasFilters() {
    return Object.keys(this._wigService.getFilter()).length;
  }

  patchFilters(filter: WigFilter) {
    this._wigService.patchFilter(filter);
  }
}
