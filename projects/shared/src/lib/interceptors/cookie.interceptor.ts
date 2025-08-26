import { isPlatformBrowser, isPlatformServer } from "@angular/common";
import { HttpClient, HttpInterceptorFn } from "@angular/common/http";
import { inject, PLATFORM_ID } from "@angular/core";
import { EMPTY, switchMap, tap } from "rxjs";
import { CookieService } from "../services";
import { HTTP_SKIP_ON_SERVER } from "../contexts/";

/** This interceptors ensures server cookies are transfered properly to client */
export const cookieInterceptor: HttpInterceptorFn = (req, next) => {
	const cookies = inject(CookieService);
	const http = inject(HttpClient);
	const platformId = inject(PLATFORM_ID);
	const isServer = isPlatformServer(platformId);

	if (req.context.get(HTTP_SKIP_ON_SERVER) && isServer) {
		return EMPTY;
	}

	if (
		isPlatformBrowser(platformId) &&
		!cookies.has("XSRF-TOKEN") &&
		req.method !== "GET"
	) {
		return http
			.get("http://morganhairextensions.localhost/sanctum/csrf-cookie", {
				observe: "response",
				withCredentials: true,
			})
			.pipe(
				tap((response) => {
					console.log(response.headers.get("set-cookie"));
				}),
				switchMap(() => next(req.clone({ withCredentials: true }))),
			);
	}

	return next(req.clone({ withCredentials: true })).pipe();
};
