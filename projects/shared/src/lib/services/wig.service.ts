import { httpResource, HttpParams, HttpClient } from '@angular/common/http';
import {
  EnvironmentInjector,
  inject,
  Injectable,
  signal,
  Signal,
} from '@angular/core';
import { environment } from '../environments/environment.development';
import { Environment } from '../types/environment';
import { Paginated, Wig, WigFilter } from '../types';
import { toFormData } from '../helpers/form';

@Injectable({
  providedIn: 'root',
})
export class WigService {
  currentWig = signal<string>('');
  private environment = inject(Environment);
  private _params = signal<WigFilter>({});
  private _http = inject(HttpClient);

  wigsResource = httpResource<Paginated<Wig>>(() => ({
    url: `${this.environment.url.api}/wigs`,
    params: new HttpParams({ fromObject: { page: 1, ...this._params() } }),
  }));

  featuredWigsResource = httpResource<Array<Wig>>(() => ({
    url: `${this.environment.url.api}/wigs/featured`,
  }));

  constructor(environment: Environment) {}

  wig(slug: Signal<Wig['slug']>) {
    return httpResource<Wig>(() => {
      if (!slug()) return undefined;

      return {
        url: `${this.environment.url.api}/wig/${slug()}`,
      };
    });
  }

  recommended(slug: Signal<string>) {
    return httpResource<Array<Wig>>(() => {
      if (!slug()) return undefined;

      return {
        url: `${this.environment.url.api}/wig/${slug()}/recommended`,
      };
    });
  }

  wigResource = httpResource<Wig>(() => {
    if (!this.currentWig()) return undefined;

    return {
      url: `${environment.url.api}/wig/${this.currentWig()}`,
    };
  });

  updateWig(slug: Wig['slug'], payload: Record<string, any>) {
    const formData = toFormData(payload);

    formData.append('_method', 'PATCH');

    return this._http.post(`${this.environment.url.api}/wig/${slug}`, formData);
  }

  create(payload: any) {
    const formData = toFormData(payload);

    return this._http.post(`${this.environment.url.api}/wig`, formData);
  }

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

    this._params.set(filters);
  }

  getFilter() {
    return this._params();
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
