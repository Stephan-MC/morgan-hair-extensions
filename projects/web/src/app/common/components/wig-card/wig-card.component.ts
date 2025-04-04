import { CurrencyPipe, PercentPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ImageComponent, Wig } from 'shared';
import { ProductHelper } from '../../helpers/product.helper';
import { WigService } from '../../services/wig.service';
import { CartStore } from '../../stores/cart.store';

@Component({
  selector: 'web-wig-card',
  imports: [CurrencyPipe, PercentPipe, RouterLink, ImageComponent],
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
  readonly cart = inject(CartStore);
  wig = input.required<Wig>();
  thumbnailLoadingPriority = input<boolean>(false);
  like = output<boolean>();
  length = linkedSignal(
    () =>
      this.wig().lengths.find((l) => l.default) ?? this.wig().lengths.at(0)!,
  );
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
