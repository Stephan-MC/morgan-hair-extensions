import { httpResource } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ENVIRONMENT } from "../../types/environment";
import { Wig } from "../../types/wig";

@Injectable({
	providedIn: "root",
})
export class TextureService {
	environment = inject(ENVIRONMENT);
	texturesResource = httpResource<Array<Wig.Texture>>(
		() => `${this.environment.url.api}/textures`,
	);
}
