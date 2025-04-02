import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WigService } from '../../services/wig.service';
import { ColorService } from '../../services/wig/color.service';
import { LengthService } from '../../services/wig/length.service';
import { ChipComponent } from '../chip/chip.component';
import { WigFilter } from 'shared';
import { HairTypeService } from '../../services/wig/hair-type.service';
import { TextureService } from '../../services/wig/texture.service';
import { LaceService } from '../../services/wig/lace.service';
import { SourceService } from '../../services/wig/source.service';
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopFilterComponent {
  private _wigService = inject(WigService);
  private _router = inject(Router);
  private _viewPortScroller = inject(ViewportScroller);
  colors = inject(ColorService).colorsResource;
  laces = inject(LaceService).lacesResource;
  sources = inject(SourceService).sourcesResource;
  hairTypes = inject(HairTypeService).hairTypesResource;
  lengths = inject(LengthService).lengthsResource;
  textures = inject(TextureService).texturesResource;
  filterChange = output<WigFilter>();
  open = input(false);
  show = linkedSignal(() => this.open());
  _open = output({ alias: 'open' });
  _close = output({ alias: 'close' });

  filters: WigFilter = {
    q: '',
    color: '',
    lace: '',
    source: '',
    length: '',
    hair_type: '',
    texture: '',
    page: 1,
  };

  updateFilter<K extends keyof WigFilter>(key: K, value: WigFilter[K]) {
    if (this.filters[key] == value) return;

    this.filters[key] = value;
  }

  applyFilters() {
    this.filters.page = 1;
    this.filterChange.emit(this.filters);
    this._wigService.setFilter(this.filters);
    this._viewPortScroller.scrollToPosition([0, 0]);

    this.closeFilters();
  }

  clearFilters() {
    Object.keys(this.filters).forEach((key) => {
      const k = key as keyof WigFilter;

      delete this.filters[k];
    });

    this._router.navigate(['/shop']);
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
