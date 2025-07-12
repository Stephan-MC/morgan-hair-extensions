import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input
} from '@angular/core';
import {
    ClientStore,
    ImageComponent,
    RatingComponent,
    Review
} from 'shared';

@Component({
  selector: 'web-review',
  imports: [ImageComponent, RatingComponent],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewComponent {
  review = input.required<Review>({ alias: 'review'});
  readonly clientStore = inject(ClientStore)
}
