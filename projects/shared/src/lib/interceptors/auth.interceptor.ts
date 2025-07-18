import { isPlatformBrowser } from "@angular/common";
import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject, PLATFORM_ID } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { catchError, EMPTY, from, throwError } from "rxjs";
import { CookieService } from "../services";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
	const router = inject(Router);
	const route = inject(ActivatedRoute);
	const platformId = inject(PLATFORM_ID);
	const cookies = inject(CookieService);

	return next(req).pipe(
		catchError((error) => {
			if (error instanceof HttpErrorResponse) {
				if (
					[401, 419].includes(error.status) &&
					isPlatformBrowser(platformId)
				) {
					if (error.status == 419) {
						cookies.clear();
					}

					// if (
					// 	!router.url.match(new RegExp(/(login|signup)$/)) &&
					// 	req.url.endsWith("/user")
					// ) {
					// 	router.navigate(["/login"]).finally(() => location.reload());
					// }
				}
			}

			return throwError(() => error);
		}),
	);
};
