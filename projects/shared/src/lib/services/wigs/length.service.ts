import { httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Environment, Wig } from '../../types';

@Injectable({
  providedIn: 'root',
})
export class LengthService {
  environemt = inject(Environment);
  lengthsResource = httpResource<Array<Wig.Length>>(
    `${this.environemt.url.api}/lengths`,
    {
      defaultValue: [],
    },
  );
}
