import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Cookie } from "../services/cookie.service";

export const xsrfInterceptor: HttpInterceptorFn = (req, next) => {
	const cookies = inject(Cookie);

	if (req.url.endsWith("/sanctum/csrf-cookie")) return next(req);

	var token = cookies.get("XSRF-TOKEN")!;

	return next(
		req.clone({
			headers: req.headers.set("X-XSRF-TOKEN", token),
			withCredentials: true,
		}),
	);
};
