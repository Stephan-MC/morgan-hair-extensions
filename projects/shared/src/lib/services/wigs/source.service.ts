import { httpResource } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Environment } from "../../types/environment";
import { Wig } from "../../types";

@Injectable({
	providedIn: "root",
})
export class SourceService {
	environment = inject(Environment);
	sourcesResource = httpResource<Array<Wig.Source>>(
		() => `${this.environment.url.api}/sources`,
	);
}
