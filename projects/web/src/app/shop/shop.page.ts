import { ViewportScroller } from '@angular/common';
import {
  Component,
  effect,
  inject,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../common/components/pagination/pagination.component';
import { ProductCardSkeletonComponent } from '../common/components/product-card-skeleton/product-card-skeleton.component';
import { ShopFilterComponent } from '../common/components/shop-filter/shop-filter.component';
import { WigCardComponent } from '../common/components/wig-card/wig-card.component';
import { WigService } from '../common/services/wig.service';
import { CartStore } from '../common/stores/cart.store';
import { WigFilter } from 'shared';

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
  readonly viewPortScroller = inject(ViewportScroller);
  private _wigService = inject(WigService);
  wigs = this._wigService.wigsResource;
  cart = inject(CartStore);
  filterOpen = signal(false);

  _page = input<number>(undefined, { alias: 'page' });
  page = linkedSignal(() => this._page());

  constructor() {
    effect(() => {
      if (this.page()) {
        this.viewPortScroller.scrollToPosition([0, 0]);
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
