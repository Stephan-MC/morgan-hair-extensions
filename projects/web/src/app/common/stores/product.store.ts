import {
  signalStore,
  type,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { entityConfig, withEntities } from '@ngrx/signals/entities';
import { Product } from 'shared';
import { inject } from '@angular/core';
import { ProductService } from '../services/product.service';

const productEnitity = entityConfig({
  entity: type<Product>(),
});

export const ProductStore = signalStore(
  { providedIn: 'root' },
  withState({}),
  withEntities(productEnitity),
  withMethods((store, productService = inject(ProductService)) => ({})),
);
