import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Wig } from '../../types/wig';

@Injectable({
  providedIn: 'root',
})
export class ColorService {
  colorsResource = httpResource<Array<Wig.Color>>(() => ({
    url: `${environment.url.api}/colors`,
  }));
}
