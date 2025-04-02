import { httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Environment } from '../../types/environment';
import { Wig } from '../../types/wig';

@Injectable({
  providedIn: 'root',
})
export class TextureService {
  environment = inject(Environment);
  texturesResource = httpResource<Array<Wig.Texture>>(
    `${this.environment.url.api}/textures`,
  );
}
