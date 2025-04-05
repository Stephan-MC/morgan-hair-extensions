import { NgClass } from '@angular/common';
import { Component, input, linkedSignal } from '@angular/core';

@Component({
  selector: 'rating',
  imports: [NgClass],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css',
  host: {
    class: '"flex gap-px"',
    '(mouseleave)': '!readonly() && star.set(rating())',
  },
})
export class RatingComponent {
  value = input(0);
  readonly = input<boolean>(true);
  stars = 5;
  star = linkedSignal(() => this.value());
}
