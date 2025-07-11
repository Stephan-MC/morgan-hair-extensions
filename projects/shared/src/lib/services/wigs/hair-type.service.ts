import { inject, Injectable } from "@angular/core";
import { Environment } from "../../types/environment";
import { httpResource } from "@angular/common/http";
import { Wig } from "../../types";

@Injectable({
	providedIn: "root",
})
export class HairTypeService {
	environment = inject(Environment);
	hairTypesResource = httpResource<Array<Wig.HairType>>(
		() => `${this.environment.url.api}/hair-types`,
		{
			defaultValue: [],
		},
	);
}
