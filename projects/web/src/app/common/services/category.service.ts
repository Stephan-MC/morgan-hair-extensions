import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Category } from '../types/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  categoryResource = httpResource<Array<Category>>(() => ({
    url: `${environment.url.api}/categories`,
  }));
}
