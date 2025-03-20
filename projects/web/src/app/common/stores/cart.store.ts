import { computed, inject, InjectionToken, PLATFORM_ID } from '@angular/core';
import {
  patchState,
  signalStore,
  type,
  watchState,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  entityConfig,
  removeEntity,
  setAllEntities,
  setEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { Product } from '../types/product';
import { ProductHelper } from '../helpers/product.helper';
import { isPlatformBrowser } from '@angular/common';
import { Wig } from '../types/wig';

export interface CartItem
  extends Pick<Product, 'id' | 'name' | 'price' | 'discounts' | 'thumbnail'> {
  quantity: number;
}

interface CartStoreInterface {
  /** Determines wherether the card component should be displayed or not */
  show: boolean;

  /** When set to true, the cart will show when ever something is added to it */
  showCartOnAdd: true;
}

const initialState: CartStoreInterface = {
  show: false,
  showCartOnAdd: true,
};

const CART_STORE = new InjectionToken<CartStoreInterface>('cart', {
  factory: (platformId = inject(PLATFORM_ID)) => {
    if (isPlatformBrowser(platformId)) {
      const savedState = localStorage.getItem('cart');

      if (savedState) {
        const parsedState = JSON.parse(savedState);

        const entities = parsedState.entities ?? {};
        const products = (entities.products ?? []) as Array<CartItem>;

        if (products.length) {
          /** ts-ignore */
          // patchState(this, setAllEntities(products, productEntity));
        }
      }
    }
    return initialState;
  },
});

const wigEntity = entityConfig({
  entity: type<CartItem>(),
  collection: 'wig',
});

export const CartStore = signalStore(
  { providedIn: 'root' },
  withState(() => inject(CART_STORE)),
  withEntities<CartItem>(),
  withComputed(({ entities }) => ({
    total: computed(() =>
      entities().reduce(
        (subtotal, product) =>
          new ProductHelper(product).discountedPrice() * product.quantity +
          subtotal,
        0,
      ),
    ),

    count: computed(() => entities().length),
  })),

  withMethods((store) => ({
    add: (product: CartItem | Product | Wig) => {
      const newProduct: CartItem = store
        .entities()
        .find((p) => p.id == product.id) ?? {
        id: product.id,
        name: product.name,
        quantity: 0,
        price: product.price,
        discounts: product.discounts,
        thumbnail: product.thumbnail,
      };

      ++newProduct.quantity;

      patchState(store, setEntity(newProduct), { show: true });
    },

    reduce: (product: CartItem | Product) => {
      const newProduct: CartItem = store
        .entities()
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
          ? removeEntity(newProduct.id)
          : setEntity(newProduct),
        store.showCartOnAdd() ? { show: true } : {},
      );
    },

    remove: (product: Product | CartItem) => {
      patchState(store, removeEntity(product.id));
    },

    has: (product: Product | CartItem | Product['id'] | Wig) => {
      return store
        .entities()
        .some((p) =>
          typeof product == 'string'
            ? p.id == product
            : p.id == (product as Product).id,
        );
    },

    setQuantity: (product: Product | CartItem, quantity: number) => {
      if (quantity < 1) {
        return;
      }

      const newProduct: CartItem = store
        .entities()
        .find((p) => p.id == product.id) ?? {
        id: product.id,
        name: product.name,
        quantity: 0,
        price: product.price,
        discounts: product.discounts,
        thumbnail: product.thumbnail,
      };

      newProduct.quantity = quantity;

      patchState(store, setEntity(newProduct));
    },

    /** Close the cart component */
    close: () => {
      patchState(store, { show: false });
    },

    open: () => patchState(store, { show: true }),
  })),
  withHooks((store) => {
    const platformId = inject(PLATFORM_ID);

    return {
      onInit: () => {
        if (isPlatformBrowser(platformId)) {
          const localState = localStorage.getItem('cart');

          if (localState) {
            const parsedState = JSON.parse(localState);

            const entities = Object.values(
              parsedState.entityMap,
            ) as Array<CartItem>;

            delete parsedState.enitityMap;
            delete parsedState.ids;

            patchState(store, setAllEntities(entities), { ...parsedState });
          }
        }

        watchState(store, (state) => {
          if (isPlatformBrowser(platformId)) {
            const localState = localStorage.getItem('cart') ?? '{}';

            const parsedState = JSON.parse(localState);

            parsedState.entities = {
              ...(parsedState.entities ?? {}),
              ...state,
              wigs: store.entities(),
            };

            localStorage.setItem('cart', JSON.stringify({ ...state }));
          }
        });
      },
    };
  }),
);
