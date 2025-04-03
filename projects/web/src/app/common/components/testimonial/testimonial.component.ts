import { Component, input } from '@angular/core';
import { Testimonial } from 'shared';

@Component({
  selector: 'web-testimonial',
  imports: [],
  templateUrl: './testimonial.component.html',
  styleUrl: './testimonial.component.css',
})
export class TestimonialComponent {
  testimonial = input.required<Testimonial>();
}
