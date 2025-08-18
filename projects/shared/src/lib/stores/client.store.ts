import { HttpClient } from "@angular/common/http";
import { computed, inject, InjectionToken, signal } from "@angular/core";
import {
	patchState,
	signalStore,
	withComputed,
	withHooks,
	withMethods,
	withProps,
	withState,
} from "@ngrx/signals";
import { EMPTY, throwError } from "rxjs";
import { catchError, switchMap, tap } from "rxjs/operators";
import { DBInstance, DbService } from "../services/db.service";
import { Client } from "../types";
import { ENVIRONMENT } from "../types/environment";

export interface ClientStoreInterface {
	client: Client | null;
}

const CLIENT_STORE = new InjectionToken<ClientStoreInterface>("CLIENT_STORE", {
	providedIn: "root",
	factory: (_http = inject(HttpClient), _environment = inject(ENVIRONMENT)) => {
		let initialState = { client: null };

		return initialState;
	},
});

export const ClientStore = signalStore(
	{ providedIn: "root" },
	withState(() => inject(CLIENT_STORE)),
	withProps(
		(
			store,
			dbService = inject(DbService),
			httpClient = inject(HttpClient),
			environment = inject(ENVIRONMENT),
		) => ({
			_db: dbService.open({
				name: "clients",
				version: 1,
				stores: [
					{ name: "client", options: { keyPath: "id" } },
					{ name: "access_tokens", options: { keyPath: "plainTextToken" } },
				],
			}) as Promise<DBInstance>,
			_http: httpClient,
			_environment: environment,
		}),
	),
	withMethods((store) => ({
		logout: () => {
			if (store.client() !== null) {
				store._http.post<void>(`${store._environment.url.api}/logout`, {}).pipe(
					tap(() => {
						store._db.then((db) =>
							db?.delete("client", (store.client() as Client)?.id),
						);
					}),
				);
			}
		},

		login: (payload: { email: string; password: string; remember: boolean }) =>
			store._http
				.post<void>(`${store._environment.url.base}/login`, payload, {
					headers: {
						accept: "application/json",
					},
				})
				.pipe(
					switchMap(() =>
						store._http.get<Client>(`${store._environment.url.api}/user`).pipe(
							tap((client) => {
								store._db.then((db) =>
									db
										.update("client", client)
										/** @ts-ignore */
										.then(() => store.client.set(client)),
								);
							}),
						),
					),
				),

		signup: (payload: Record<string, any>) =>
			store._http
				.post<void>(`${store._environment.url.base}/signup`, payload, {
					headers: {
						accept: "application/json",
					},
				})
				.pipe(
					switchMap(() =>
						store._http
							.get<Client>(`${store._environment.url.api}/user`)
							.pipe(
								tap((client) =>
									store._db.then((db) =>
										db.clear("client").then((a) => db.update("client", client)),
									),
								),
							),
					),
				),
	})),
	withComputed(({ client }) => ({
		full_name: computed(() => client()?.first_name + " " + client()?.last_name),
	})),
	withHooks({
		onInit: (store) => {
			store._http
				.get<Client>(`${store._environment.url.api}/user`)
				.pipe(
					tap((client) => patchState(store, { client })),
					catchError((error) => EMPTY),
				)
				.subscribe();
		},
	}),
);
