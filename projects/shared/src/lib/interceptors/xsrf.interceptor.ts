import {
	HttpClient,
	HttpHeaders,
	HttpInterceptorFn,
	HttpXsrfTokenExtractor,
} from "@angular/common/http";
import { inject } from "@angular/core";
import { CookieService } from "../services/cookie.service";
import { Environment } from "../types/environment";
import { delay } from "rxjs";

export const xsrfInterceptor: HttpInterceptorFn = (req, next) => {
	const cookies = inject(CookieService);
	const http = inject(HttpClient);
	const environment = inject(Environment);
	const tokenExtractor = inject(HttpXsrfTokenExtractor);

	console.log("XSRF-INTERCEPTOR -> INIT -> ", req.url);

	if (req.method !== "GET") {
		return next(
			req.clone({
				headers: req.headers.set(
					"X-XSRF-TOKEN",
					String(tokenExtractor.getToken()),
				),
			}),
		);
	}

	return next(req.clone());
};
