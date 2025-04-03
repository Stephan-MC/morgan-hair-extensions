import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Review } from 'shared';
import { ImageComponent } from 'shared';
import { ReviewComponent } from '../review/review.component';

@Component({
  selector: 'web-review-list',
  imports: [ReviewComponent],
  templateUrl: './review-list.component.html',
  styleUrl: './review-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewListComponent {
  reviews = input.required<Array<Review>>();
}
