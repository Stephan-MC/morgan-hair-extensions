import { HttpClient, HttpParams, httpResource } from '@angular/common/http';
import { inject, Injectable, linkedSignal, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Paginated } from '../types';
import { Product, ProductFilters } from '../types/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private _http = inject(HttpClient);
  private filters = signal<ProductFilters>({ sort: 'desc' });

  featuredProductsResource = httpResource<Array<Product>>(() => ({
    url: `${environment.url.api}/products/featured`,
  }));

  productsResource = httpResource<Paginated<Product>>(() => {
    return {
      url: `${environment.url.api}/products`,
      params: new HttpParams({ fromObject: { ...this.filters() } }),
    };
  });

  setFilters(filters: ProductFilters) {
    const newFilters: Partial<ProductFilters> = {};

    Object.keys(filters).forEach((key) => {
      const k = key as keyof ProductFilters;

      /** @ts-ignore */
      if (filters[k] != '') newFilters[k] = filters[k];
    });

    this.filters.set(newFilters);
  }

  like(product: Product | Product['id']) {
    fetch(
      `${environment.url.api}/product/${typeof product == 'string' ? product : product.id}/like`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    ).then((res) => res.json());
  }

  unlike(product: Product | Product['id']) {
    fetch(
      `${environment.url.api}/product/${typeof product == 'string' ? product : product.id}/unlike`,
    ).then((res) => res.json());
  }
}
