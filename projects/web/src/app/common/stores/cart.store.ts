import { isPlatformBrowser } from '@angular/common';
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
  SelectEntityId,
  setAllEntities,
  setEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { Discount, Wig } from 'shared';
import { ProductHelper } from '../helpers/product.helper';

export interface CartItem extends Pick<Wig, 'id' | 'name' | 'thumbnail'> {
  quantity: number;
  length: Pick<Wig.Length, 'id' | 'value'>;
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

const selectId: SelectEntityId<CartItem> = (wig) =>
  wig.id + ':' + wig.length.id;
const entity = entityConfig({ entity: type<CartItem>(), selectId });

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
    add: (item: CartItem | Wig, openCart: boolean = store.showCartOnAdd()) => {
      const newProduct: CartItem = store
        .entities()
        .find((p) => p.id == item.id && p.length.id == item.length.id) ?? {
        id: item.id,
        name: item.name,
        quantity: 0,
        price: (item as CartItem).price ?? (item as Wig).length.price,
        length: item.length,
        discount: item.discount,
        thumbnail: item.thumbnail,
      };

      ++newProduct.quantity;

      patchState(store, setEntity(newProduct, entity), { show: openCart });
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
        length: wig.length,
        discount: wig.discount,
        thumbnail: wig.thumbnail,
      };

      --newProduct.quantity;

      patchState(
        store,
        newProduct.quantity <= 0
          ? removeEntity(newProduct.id + ':' + newProduct.length.id)
          : setEntity(newProduct, entity),
        { show: openCart },
      );
    },

    remove: (item: CartItem) => {
      patchState(store, removeEntity(`${item.id}:${item.length.id}`));
    },

    has: (item: CartItem | Wig | string) => {
      return store
        .entities()
        .some((p) =>
          typeof item == 'string'
            ? p.id + ':' + p.length.id == item
            : p.id == (item as Wig).id &&
              p.length.id == (item as Wig).length.id,
        );
    },

    get: (item: CartItem | string) =>
      store
        .entities()
        .find((p) =>
          typeof item == 'string'
            ? p.id + ':' + p.length.id == item
            : p.id == (item as CartItem).id &&
              p.length.id == (item as CartItem).length.id,
        ),

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
        length: item.length,
        discount: item.discount,
        thumbnail: item.thumbnail,
      };

      newProduct.quantity = quantity;

      patchState(store, setEntity(newProduct, entity));
    },

    canBeAdded: (item: Wig) => {
      return (
        item.stock >
        (store
          .entities()
          .find((p) => p.id == item.id && p.length.id == item.length.id)
          ?.quantity ?? 0)
      );
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

            patchState(store, setAllEntities(entities, entity), {
              ...parsedState,
            });
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
