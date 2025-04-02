import { HttpClient } from '@angular/common/http';
import { computed, inject, InjectionToken } from '@angular/core';
import {
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { withEntities } from '@ngrx/signals/entities';
import { Wig, WigFilter, WigService } from 'shared';

export interface WigStore {
  initialised: boolean;
}

export const WIG_STORE = new InjectionToken<WigStore>('wigs', {
  factory: () => ({ initialised: false }),
});

export const WigStore = signalStore(
  withState(() => inject(WIG_STORE)),
  withEntities<Wig>(),
  withProps(
    (
      store,
      wigService = inject(WigService),
      httpClient = inject(HttpClient),
    ) => ({
      _filters: {} as WigFilter,
      _wigResource: wigService.wigsResource,
      _http: httpClient,
    }),
  ),
  withComputed((store) => ({
    wigs: computed(() => store._wigResource.value()),
  })),
  withMethods((store) => ({
    create: (payload: any) => {
      // store._http.post()
    },
  })),
  withHooks((store) => ({})),
);
