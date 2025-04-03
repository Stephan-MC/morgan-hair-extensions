import {
  ChangeDetectionStrategy,
  Component,
  input,
  linkedSignal,
} from '@angular/core';
import {
  ClientReview,
  ImageComponent,
  RatingComponent,
  ReactionType,
  Review,
  ReviewModel,
} from 'shared';

@Component({
  selector: 'web-review',
  imports: [ImageComponent, RatingComponent],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewComponent {
  _review = input.required<
    {
      client: Pick<ReviewModel['client'], 'first_name' | 'last_name'>;
      rating: {
        rate: ReviewModel['rating']['rate'];
        type: Pick<ReviewModel['rating']['type'], 'name' | 'mass'>;
      };
      comment: { body: string };
    },
    Review
  >({
    alias: 'review',
    transform: (review) => {
      const value = {};
      if (!(review as ReviewModel).client) {
        return {
          client: { first_name: 'You', last_name: '' },
          comment: {
            body: (review as ClientReview).body,
          },
          rating: {
            rate: (review as ClientReview).rating,
            type: {
              name: ReactionType.RATING,
              mass: 1,
            },
          },
        };
      }

      return review as ReviewModel;
    },
  });
  review = linkedSignal(() => this._review());
}
