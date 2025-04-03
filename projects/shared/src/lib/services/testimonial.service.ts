import { httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Testimonial } from '../types/testimonial';
import { Environment } from '../types/environment';

@Injectable({
  providedIn: 'root',
})
export class TestimonialService {
  private _environment = inject(Environment);

  testimonialsResource = httpResource<Array<Testimonial>>(
    `${this._environment.url.api}/testimonials`,
  );
}
