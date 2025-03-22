import { Component, effect, inject, input, linkedSignal } from '@angular/core';
import { WigService } from '../common/services/wig.service';

@Component({
  selector: 'web-wig',
  imports: [],
  templateUrl: './wig.page.html',
  styleUrl: './wig.page.css',
})
export class WigPage {
  private _wigService = inject(WigService);
  slug = input.required<string>();

  wig = this._wigService.wig(this.slug);

  constructor() {
    effect(() => {
      this._wigService.currentWig.set(this.slug());
    });
  }

  ngOnDestroy() {
    this._wigService.currentWig.set('');
  }
}
