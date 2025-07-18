import { InjectionToken } from "@angular/core";

const domain = "morganhairextensions.com";

export interface Environment extends Record<string, any> {
	url: {
		base: string;
		api: string;
	};
	production: boolean;
}

export const Environment = new InjectionToken<Environment>("environments", {
	providedIn: "root",
	factory: () => ({
		url: {
			base: `https://${domain}`,
			api: `https://api.${domain}`,
		},
		production: true,
	}),
});
