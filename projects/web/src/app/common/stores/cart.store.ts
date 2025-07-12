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
  withProps,
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
import { DBInstance, DbService, Discount, Wig } from 'shared';
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
  factory: (platformId = inject(PLATFORM_ID), db = inject(DbService)) => {
    if (isPlatformBrowser(platformId)) {
    }
    return initialState;
  },
});

export const CartStore = signalStore(
  { providedIn: 'root' },
  withState(() => inject(CART_STORE)),
  withProps((store, dbService = inject(DbService)) => ({
    _db: dbService.open({
      name: 'wigs',
      version: 1,
      stores: [
        {
          name: 'cart',
          options: { keyPath: ['id', 'length.id'], autoIncrement: false },
        },
      ],
    }) as Promise<DBInstance>,
  })),
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
      store._db.then((db) => db.update<CartItem>('cart', newProduct));
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
      store._db.then((db) =>
        newProduct.quantity <= 0
          ? db.delete('cart', [newProduct.id, newProduct.length.id])
          : db.update<CartItem>('cart', newProduct),
      );
    },

    remove: (item: CartItem) => {
      patchState(store, removeEntity(`${item.id}:${item.length.id}`));
      store._db.then((db) => db.delete('cart', [item.id, item.length.id]));
    },

    has: (item: CartItem | Wig | string) => {
      return !!store.entityMap()[
        typeof item == 'string' ? item : `${item.id}:${item.length.id}`
      ];
    },

    get: (item: CartItem | Wig | string): CartItem | undefined =>
      store.entityMap()[
        typeof item == 'string'
          ? item
          : (item as CartItem).id + ':' + (item as CartItem).length.id
      ],

    /** Manually set the quantity of an item in cart */
    setQuantity: (item: Wig | CartItem, quantity: number) => {
      if (quantity < 1) {
        return;
      }

      const newProduct: CartItem = store.entityMap()[
        item.id + ':' + item.length.id
      ] ?? {
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
      store._db.then((db) => db.update<CartItem>('cart', newProduct));
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
          store._db.then((db) =>
            db.getAll<CartItem>('cart').then((items) => {
              patchState(store, setAllEntities(items, entity));
            }),
          );
        }

        watchState(store, (state) => {
          // Do something whenever state changes
        });
      },
    };
  }),
);
