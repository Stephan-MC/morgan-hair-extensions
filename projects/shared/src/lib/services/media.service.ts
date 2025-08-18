import { inject, Injectable } from '@angular/core';
import { ENVIRONMENT } from '../types/environment';
import { Media } from '../types/media';
import { HttpClient } from '@angular/common/http';
import { Wig } from '../types/wig';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  environment = inject(ENVIRONMENT);
  private _http = inject(HttpClient);

  detach(slug: Wig['slug'], id: Media['id']) {
    return this._http.delete<void>(
      `${this.environment.url.api}/${slug}/file/${id}`,
    );
  }
}
