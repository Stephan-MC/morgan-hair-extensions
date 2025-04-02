import { Component, input, model } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Paginated } from 'shared';

@Component({
  selector: 'web-pagination',
  imports: [RouterLink],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class PaginationComponent {
  /** Pagination Metadata */
  meta = input.required<Paginated['meta']>();

  page = model<number>();

  next() {
    if (!this.meta().links.at(-1)?.url) {
      return;
    }

    this.page.set(this.meta().current_page + 1);
  }

  previous() {
    if (!this.meta().links.at(-1)?.url) {
      return;
    }

    this.page.set(this.meta().current_page - 1);
  }
}
