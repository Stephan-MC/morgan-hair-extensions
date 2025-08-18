import { InjectionToken } from "@angular/core";

const domain = "morganhairextensions.com";

export interface ENVIRONMENT extends Record<string, any> {
	url: {
		base: string;
		api: string;
	};
	production: boolean;
}

export const ENVIRONMENT = new InjectionToken<ENVIRONMENT>("ENVIRONMENT");
