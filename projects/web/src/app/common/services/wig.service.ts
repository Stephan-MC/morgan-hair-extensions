import { HttpParams, httpResource } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import type { Paginated } from '../types';
import type { Wig, WigFilter } from '../types/wig';

@Injectable({
  providedIn: 'root',
})
export class WigService {
  private _params = signal<WigFilter>({});

  wigsResource = httpResource<Paginated<Wig>>(() => ({
    url: `${environment.url.api}/wigs`,
    params: new HttpParams({ fromObject: { page: 1, ...this._params() } }),
  }));

  patchFilter(params: WigFilter) {
    Object.keys(params).forEach((k) => {
      const key = k as keyof WigFilter;

      if (params[key] != '') {
        this._params.update((value) => ({ ...value, [key]: params[key] }));
      }
    });
  }

  setFilter(params: WigFilter) {
    var filters: typeof params = {};

    Object.keys(params)
      .filter((k) => params[k as keyof WigFilter] !== '')
      .forEach((key) => {
        const k = key as keyof typeof params;

        filters = { ...filters, [k]: params[k] };
      });
    console.log(params, filters);

    this._params.set(filters);
  }

  like(wig: Wig | Wig['id']) {
    fetch(
      `${environment.url.api}/wig/${typeof wig == 'string' ? wig : wig.id}/like`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    ).then((res) => res.json());
  }

  unlike(wig: Wig | Wig['id']) {
    fetch(
      `${environment.url.api}/wig/${typeof wig == 'string' ? wig : wig.id}/unlike`,
    ).then((res) => res.json());
  }
}
