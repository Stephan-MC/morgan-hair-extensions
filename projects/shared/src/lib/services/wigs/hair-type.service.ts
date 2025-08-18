import { inject, Injectable } from "@angular/core";
import { ENVIRONMENT } from "../../types/environment";
import { httpResource } from "@angular/common/http";
import { Wig } from "../../types";

@Injectable({
	providedIn: "root",
})
export class HairTypeService {
	environment = inject(ENVIRONMENT);
	hairTypesResource = httpResource<Array<Wig.HairType>>(
		() => `${this.environment.url.api}/hair-types`,
		{
			defaultValue: [],
		},
	);
}
