import { computed, inject, InjectionToken } from '@angular/core';
import {
  patchState,
  signalStore,
  type,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  entityConfig,
  removeEntity,
  setEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { Product } from '../types/product';
import { ProductHelper } from '../helpers/product.helper';

export interface CartProduct
  extends Pick<Product, 'id' | 'name' | 'price' | 'discounts' | 'thumbnail'> {
  quantity: number;
}

interface CartStoreInterface {
  /** Determines wherether the card component should be displayed or not */
  show: boolean;
}

const initialState: CartStoreInterface = {
  show: false,
};

const CART_STORE = new InjectionToken<CartStoreInterface>('cart', {
  factory: () => initialState,
});

const productEntity = entityConfig({
  entity: type<CartProduct>(),
  collection: 'products',
});

export const CartStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withEntities(productEntity),
  withComputed(({ productsEntities }) => ({
    total: computed(() =>
      productsEntities().reduce(
        (subtotal, product) =>
          new ProductHelper(product).discountedPrice() * product.quantity +
          subtotal,
        0,
      ),
    ),
  })),

  withMethods((store) => ({
    add: (product: CartProduct | Product) => {
      const newProduct: CartProduct = store
        .productsEntities()
        .find((p) => p.id == product.id) ?? {
        id: product.id,
        name: product.name,
        quantity: 0,
        price: product.price,
        discounts: product.discounts,
        thumbnail: product.thumbnail,
      };

      ++newProduct.quantity;

      patchState(store, setEntity(newProduct, productEntity), { show: true });
    },

    reduce: (product: CartProduct | Product) => {
      const newProduct: CartProduct = store
        .productsEntities()
        .find((p) => p.id == product.id) ?? {
        id: product.id,
        name: product.name,
        quantity: 0,
        price: product.price,
        discounts: product.discounts,
        thumbnail: product.thumbnail,
      };

      --newProduct.quantity;

      patchState(
        store,
        newProduct.quantity <= 0
          ? removeEntity(newProduct.id, productEntity)
          : setEntity(newProduct, productEntity),
      );
    },

    remove: (product: Product | CartProduct) => {
      patchState(store, removeEntity(product.id, productEntity));
    },

    has: (product: Product | CartProduct | Product['id']) => {
      return store
        .productsEntities()
        .some((p) =>
          typeof product == 'string'
            ? p.id == product
            : p.id == (product as Product).id,
        );
    },

    /** Close the cart component */
    close: () => {
      patchState(store, { show: false });
    },
  })),
);
