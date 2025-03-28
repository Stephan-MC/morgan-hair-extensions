import { httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Environment } from '../../types/environment';
import { Wig } from '../../types';

@Injectable({
  providedIn: 'root',
})
export class ColorService {
  environment = inject(Environment);
  colorsResource = httpResource<Array<Wig.Color>>(() => ({
    url: `${this.environment.url.api}/colors`,
  }));
}
