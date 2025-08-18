import { httpResource } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ENVIRONMENT } from "../../types/environment";
import { Wig } from "../../types";

@Injectable({
	providedIn: "root",
})
export class SourceService {
	environment = inject(ENVIRONMENT);
	sourcesResource = httpResource<Array<Wig.Source>>(
		() => `${this.environment.url.api}/sources`,
	);
}
