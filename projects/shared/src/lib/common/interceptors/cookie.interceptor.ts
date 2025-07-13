import { isPlatformBrowser, isPlatformServer } from "@angular/common";
import { HttpInterceptorFn, HttpResponse } from "@angular/common/http";
import { inject, PLATFORM_ID, RESPONSE_INIT } from "@angular/core";
import {} from "@angular/ssr";
import { tap } from "rxjs";
import { Cookie } from "../../services/cookie.service";

export const cookieInterceptor: HttpInterceptorFn = (req, next) => {
	const cookies = inject(Cookie);
	const platformId = inject(PLATFORM_ID);

	if (isPlatformBrowser(platformId)) {
		return next(req.clone({ withCredentials: true }));
	}

	const ssrResponse = inject(RESPONSE_INIT);

	return next(req).pipe(
		tap((event) => {
			if (event instanceof HttpResponse) {
				const cookieHeaders = event.headers.getAll("set-cookie");

				if (cookieHeaders && isPlatformServer(platformId)) {
					const headers = new Headers();

					cookieHeaders.forEach((header) => {
						headers.set("Set-Cookie", header);
					});

					ssrResponse!.headers = headers;

					cookies.transferCookiesToBrowser(cookieHeaders);
				}
			}
		}),
	);
};
