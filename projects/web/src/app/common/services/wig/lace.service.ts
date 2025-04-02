import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Wig } from 'shared';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LaceService {
  lacesResource = httpResource<Array<Wig.Lace>>(() => ({
    url: `${environment.url.api}/laces`,
  }));
}
