import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Wig } from '../../types/wig';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TextureService {
  texturesResource = httpResource<Array<Wig.Texture>>(() => ({
    url: `${environment.url.api}/textures`,
  }));
}
