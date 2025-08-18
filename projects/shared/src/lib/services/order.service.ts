import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { PaginatedWithExtra } from '../types';
import { ENVIRONMENT } from '../types/environment';
import type { Order, OrderExtra, OrderRequest } from '../types/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private _http = inject(HttpClient);
  environment = inject(ENVIRONMENT);

  ordersResource = httpResource<PaginatedWithExtra<Order, OrderExtra>>(() => ({
    url: `${this.environment.url.api}/orders`,
  }));

  create(payload: OrderRequest) {
    return this._http.post(`${this.environment.url.api}/order`, payload);
  }

  delete(payload: Order['id']) {
    return this._http.delete(`${this.environment.url.api}/order/${payload}`);
  }
}
