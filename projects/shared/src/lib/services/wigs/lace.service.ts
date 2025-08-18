import { httpResource } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ENVIRONMENT } from "../../types/environment";
import { Wig } from "../../types";

@Injectable({
	providedIn: "root",
})
export class LaceService {
	environment = inject(ENVIRONMENT);
	lacesResource = httpResource<Array<Wig.Lace>>(
		() => `${this.environment.url.api}/laces`,
	);
}
