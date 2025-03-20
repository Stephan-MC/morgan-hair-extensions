import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  input,
  output,
  SimpleChanges,
} from '@angular/core';
import { Wig } from '../../types/wig';
import { WigService } from '../../services/wig.service';
import { CartStore } from '../../stores/cart.store';
import { ProductHelper } from '../../helpers/product.helper';
import { CurrencyPipe, NgOptimizedImage, PercentPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'web-wig-card',
  imports: [CurrencyPipe, NgOptimizedImage, PercentPipe, RouterLink],
  templateUrl: './wig-card.component.html',
  styleUrl: './wig-card.component.css',
  host: {
    '[class.group/wig-card]': 'true',
    '[class.out]': 'wig().stock < 1',
    '[class.new]': 'wig().new',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WigCardComponent {
  private _wigService = inject(WigService);
  private _cdr = inject(ChangeDetectorRef);
  readonly cart = inject(CartStore);
  wig = input.required<Wig>();
  thumbnailLoadingPriority = input<boolean>(false);
  like = output<boolean>();
  wigHelper!: ProductHelper;

  ngOnInit() {
    this.wigHelper = new ProductHelper(this.wig());
  }

  likeWig() {
    Promise.all([
      this.wig().liked
        ? this._wigService.unlike(this.wig().id)
        : this._wigService.like(this.wig().id),
      this.like.emit(!this.wig().liked),
    ]);
  }
}
