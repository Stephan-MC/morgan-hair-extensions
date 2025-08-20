import {
	HttpInterceptorFn,
	HttpXsrfTokenExtractor,
} from "@angular/common/http";
import { inject } from "@angular/core";

export const xsrfInterceptor: HttpInterceptorFn = (req, next) => {
	const tokenExtractor = inject(HttpXsrfTokenExtractor);

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
