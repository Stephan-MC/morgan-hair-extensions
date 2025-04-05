import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ImageComponent, RatingComponent, Review } from 'shared';

@Component({
  selector: 'web-review',
  imports: [DecimalPipe, ImageComponent, RatingComponent],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewComponent {
  review = input.required<Review>();
}
