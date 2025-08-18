import {
	provideHttpClient,
	withFetch,
	withInterceptors,
	withXsrfConfiguration,
} from "@angular/common/http";
import {
	ApplicationConfig,
	provideZonelessChangeDetection,
} from "@angular/core";
import {
	provideClientHydration,
	withEventReplay,
	withIncrementalHydration,
} from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import {
	provideRouter,
	withComponentInputBinding,
	withRouterConfig,
} from "@angular/router";
import {
	authInterceptor,
	cookieInterceptor,
	ENVIRONMENT,
	xsrfInterceptor,
} from "shared";
import { environment } from "../environments/environment";
import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
	providers: [
		provideZonelessChangeDetection(),
		provideRouter(routes, withComponentInputBinding(), withRouterConfig({})),
		provideClientHydration(withEventReplay(), withIncrementalHydration()),
		provideHttpClient(
			withFetch(),
			withInterceptors([cookieInterceptor, xsrfInterceptor, authInterceptor]),
			withXsrfConfiguration({
				cookieName: "XSRF-TOKEN",
				headerName: "X-XSRF-TOKEN",
			}),
		),
		provideAnimations(),
		{ provide: ENVIRONMENT, useFactory: () => environment },
	],
};
