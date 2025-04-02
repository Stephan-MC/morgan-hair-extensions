import { httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Environment } from '../../types/environment';
import { Wig } from '../../types';

@Injectable({
  providedIn: 'root',
})
export class LaceService {
  environment = inject(Environment);
  lacesResource = httpResource<Array<Wig.Lace>>(
    `${this.environment.url.api}/laces`,
  );
}
