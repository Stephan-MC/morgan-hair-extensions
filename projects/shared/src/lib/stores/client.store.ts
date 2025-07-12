import { HttpClient } from '@angular/common/http';
import { computed, InjectionToken } from '@angular/core';
import { inject } from '@angular/core';
import {
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
  withHooks,
  patchState,
} from '@ngrx/signals';
import { Environment } from '../types/environment';
import { AccessToken, Client, PlainTextToken } from '../types';
import { catchError, map, tap } from 'rxjs/operators';
import { EMPTY, lastValueFrom } from 'rxjs';
import { DBInstance, DbService } from '../services/db.service';

export interface ClientStoreInterface {
  client: Client | null;
}

const CLIENT_STORE = new InjectionToken<ClientStoreInterface>('CLIENT_STORE', {
  providedIn: 'root',
  factory: (_http = inject(HttpClient), _environment = inject(Environment)) => {
    let initialState = { client: null };

    return  initialState
  }
});

export const ClientStore = signalStore(
  { providedIn: 'root' },
  withState(() => inject(CLIENT_STORE)),
  withProps(
    (
      store,
      dbService = inject(DbService),
      httpClient = inject(HttpClient),
      environment = inject(Environment),
    ) => ({
      _db: dbService.open({
        name: 'clients',
        version: 1,
        stores: [
          { name: 'client', options: { keyPath: 'tokenable_id' } },
          { name: 'access_tokens', options: { keyPath: 'plainTextToken' } },
        ],
      }) as Promise<DBInstance>,
      _http: httpClient,
      _environment: environment,
    }),
  ),
  withMethods((store) => ({
    logout: () => {
      if (store.client !== null) {
        store._http
          .post<void>(`${store._environment.url.api}/logout`, {})
          .pipe(
            tap(() => {
              store._db.then((db) =>
                db?.delete('client', (store.client() as Client).id),
              );
            }),
          )
          .subscribe();
      }
    },

    login: (payload: {
      email: string;
      password: string;
      remember: boolean;
    }) => {
      store._http
        .post<{
          accessToken: AccessToken;
          plainTextToken: PlainTextToken;
        }>(`${store._environment.url.api}/auth/login`, payload)
        .pipe(
          tap((token) => {
            store._db.then((db) => db?.add('access_tokens', token));
          }),
          catchError(() => EMPTY),
        )
        .subscribe();
    },

    access_token: () => {
      let token: string | null = null;

      store._db
        .then((db) =>
          db.get<{ accessToken: AccessToken; plainTextToken: PlainTextToken }>(
            'access_tokens',
            store.client()?.id ?? '',
          ),
        )
        .then((accessToken) => {
          token = accessToken!.plainTextToken;
        });

      return token;
    },
  })),
  withComputed(({ client }) => ({
    full_name: computed(() => client()?.first_name + ' ' + client()?.last_name),
  })),
  withHooks({
    onInit: (store) => {
      store._http.get<Client>(`${store._environment.url.api}/user`).pipe(tap(client => patchState(store, { client })), catchError(error => EMPTY)).subscribe()
    }
  })
);
