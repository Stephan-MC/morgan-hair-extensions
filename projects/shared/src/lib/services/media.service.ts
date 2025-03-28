import { inject, Injectable } from '@angular/core';
import { Environment } from '../types/environment';
import { Media } from '../types/media';
import { HttpClient } from '@angular/common/http';
import { Wig } from '../types/wig';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  environment = inject(Environment);
  private _http = inject(HttpClient);

  detach(slug: Wig['slug'], id: Media['id']) {
    return this._http.delete<void>(
      `${this.environment.url.api}/${slug}/file/${id}`,
    );
  }
}
