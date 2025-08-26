import {
	HttpClient,
	HttpContext,
	HttpParams,
	httpResource,
} from "@angular/common/http";
import { inject, Injectable, PLATFORM_ID, signal, Signal } from "@angular/core";
import { environment } from "../environments/environment.development";
import { toFormData } from "../helpers/form";
import { HTTP_SKIP_ON_SERVER } from "../contexts";
import { Paginated, Wig, WigFilter } from "../types";
import { ENVIRONMENT } from "../types/environment";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
	providedIn: "root",
})
export class WigService {
	currentWig = signal<string>("");
	private environment = inject(ENVIRONMENT);
	private _params = signal<WigFilter>({});
	private _http = inject(HttpClient);
	private _platformId = inject(PLATFORM_ID);
	private isBrowser = isPlatformBrowser(PLATFORM_ID);

	wigsResource = httpResource<Paginated<Wig>>(() => ({
		url: `${this.environment.url.api}/wigs`,
		params: new HttpParams({ fromObject: { page: 1, ...this._params() } }),
		context: new HttpContext().set(HTTP_SKIP_ON_SERVER, true),
	}));

	featuredWigsResource = httpResource<Array<Wig>>(() => ({
		url: `${this.environment.url.api}/wigs/featured`,
		context: new HttpContext().set(HTTP_SKIP_ON_SERVER, true),
	}));

	wig(slug: Signal<Wig["slug"]>) {
		return httpResource<Wig>(() => {
			if (!slug()) return undefined;

			return {
				url: `${this.environment.url.api}/wig/${slug()}`,
			};
		});
	}

	recommended(slug: Signal<string>) {
		return httpResource<Array<Wig>>(
			() => {
				if (!slug()) return undefined;

				return {
					url: `${this.environment.url.api}/wig/${slug()}/recommended`,
				};
			},
			{ defaultValue: [] },
		);
	}

	wigResource = httpResource<Wig>(() => {
		if (!this.currentWig()) return undefined;

		return {
			url: `${environment.url.api}/wig/${this.currentWig()}`,
		};
	});

	/** Create a review for a given wig */
	review(wig: Wig["slug"], payload: { rating: number; body: string }) {
		return this._http.post(
			`${this.environment.url.api}/wig/${wig}/review`,
			payload,
			{
				headers: {
					Accept: "application/json",
				},
			},
		);
	}

	updateWig(slug: Wig["slug"], payload: Record<string, any>) {
		const formData = toFormData(payload);

		formData.append("_method", "PATCH");

		return this._http.post(`${this.environment.url.api}/wig/${slug}`, formData);
	}

	create(payload: any) {
		const formData = toFormData(payload);

		return this._http.post(`${this.environment.url.api}/wig`, formData);
	}

	patchFilter(params: WigFilter) {
		Object.keys(params).forEach((k) => {
			const key = k as keyof WigFilter;

			if (params[key] != "") {
				this._params.update((value) => ({ ...value, [key]: params[key] }));
			}
		});
	}

	setFilter(params: WigFilter) {
		var filters: typeof params = {};

		Object.keys(params)
			.filter((k) => !!params[k as keyof WigFilter])
			.forEach((key) => {
				const k = key as keyof typeof params;

				filters = { ...filters, [k]: params[k] };
			});

		this._params.set(filters);
	}

	getFilter() {
		return this._params();
	}

	like(wig: Wig | Wig["id"]) {
		return this._http.post(
			`${environment.url.api}/wig/${typeof wig == "string" ? wig : wig.slug}/like`,
			{},
		);
	}

	unlike(wig: Wig | Wig["id"]) {
		return this._http.post(
			`${environment.url.api}/wig/${typeof wig == "string" ? wig : wig.slug}/unlike`,
			{},
		);
	}
}
