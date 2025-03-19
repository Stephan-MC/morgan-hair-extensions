import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Wig } from '../../types/wig';

@Injectable({
  providedIn: 'root',
})
export class SourceService {
  sourcesResource = httpResource<Array<Wig.Source>>(() => ({
    url: `${environment.url.api}/sources`,
  }));
}
