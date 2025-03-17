import {
  Component,
  inject,
  input,
  linkedSignal,
  output,
  signal,
} from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { ChipComponent } from '../chip/chip.component';
import { ProductService } from '../../services/product.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ProductFilters } from '../../types/product';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'web-shop-filter',
  imports: [FormsModule, ChipComponent],
  templateUrl: './shop-filter.component.html',
  styleUrl: './shop-filter.component.css',
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          height: '*',
          width: '*',
        }),
      ),
      state(
        'close',
        style({
          height: 'calc(var(--spacing) * 10)',
          width: 'calc(var(--spacing) * 30)',
        }),
      ),
      transition('open => close', animate('0.3s linear')),
      transition('close => open', animate('0.3s linear')),
    ]),
  ],
  host: {
    '[@openClose]': 'show() ? "open" : "close"',
  },
})
export class ShopFilterComponent {
  productService = inject(ProductService);
  categories = inject(CategoryService).categoryResource;
  colors = ['all', 'ox-blood', 'gold', 'black', 'violet'];
  filterChange = output<ProductFilters>();
  open = input(false);
  show = linkedSignal(() => this.open());
  _open = output({ alias: 'open' });
  _close = output({ alias: 'close' });

  filters: ProductFilters = {
    q: '',
    color: '',
    category: '',
    length: '',
    style: '',
    cat: '',
  };

  updateFilter<K extends keyof ProductFilters>(
    key: K,
    value: ProductFilters[K],
  ) {
    if (this.filters[key] == value) return;

    this.filters[key] = value;
  }

  applyFilters() {
    this.filterChange.emit(this.filters);
    this.productService.setFilters(this.filters);
  }

  openFilters() {
    if (this.show()) return;

    this._open.emit();
    this.show.set(true);
  }

  closeFilters() {
    if (!this.show()) return;

    this._close.emit();
    this.show.set(false);
  }
}
