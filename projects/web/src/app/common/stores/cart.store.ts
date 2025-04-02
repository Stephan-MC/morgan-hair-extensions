import { isPlatformBrowser } from '@angular/common';
import { computed, inject, InjectionToken, PLATFORM_ID } from '@angular/core';
import {
  patchState,
  signalStore,
  watchState,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  removeEntity,
  setAllEntities,
  setEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { Discount, Wig } from 'shared';
import { ProductHelper } from '../helpers/product.helper';

export interface CartItem extends Pick<Wig, 'id' | 'name' | 'thumbnail'> {
  quantity: number;
  price: number;
  discount?: Discount;
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
    add: (wig: CartItem | Wig, openCart: boolean = store.showCartOnAdd()) => {
      const newProduct: CartItem = store
        .entities()
        .find((p) => p.id == wig.id) ?? {
        id: wig.id,
        name: wig.name,
        quantity: 0,
        price: (wig as CartItem).price ?? (wig as Wig).length.price,
        discount: wig.discount,
        thumbnail: wig.thumbnail,
      };

      ++newProduct.quantity;

      patchState(store, setEntity(newProduct), { show: openCart });
    },

    reduce: (
      wig: CartItem | Wig,
      openCart: boolean = store.showCartOnAdd(),
    ) => {
      const newProduct: CartItem = store
        .entities()
        .find((p) => p.id == wig.id) ?? {
        id: wig.id,
        name: wig.name,
        quantity: 0,
        price: (wig as CartItem).price ?? (wig as Wig).length.price,
        discount: wig.discount,
        thumbnail: wig.thumbnail,
      };

      --newProduct.quantity;

      patchState(
        store,
        newProduct.quantity <= 0
          ? removeEntity(newProduct.id)
          : setEntity(newProduct),
        { show: openCart },
      );
    },

    remove: (product: CartItem) => {
      patchState(store, removeEntity(product.id));
    },

    has: (item: CartItem | Wig | Wig['id']) => {
      return store
        .entities()
        .some((p) =>
          typeof item == 'string' ? p.id == item : p.id == (item as Wig).id,
        );
    },

    get: (item: Wig['id']) => store.entities().find((p) => p.id == item),

    /** Manually set the quantity of an item in cart */
    setQuantity: (item: Wig | CartItem, quantity: number) => {
      if (quantity < 1) {
        return;
      }

      const newProduct: CartItem = store
        .entities()
        .find((p) => p.id == item.id) ?? {
        id: item.id,
        name: item.name,
        quantity: 0,
        price: (item as CartItem).price ?? (item as Wig).length.price,
        discount: item.discount,
        thumbnail: item.thumbnail,
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
