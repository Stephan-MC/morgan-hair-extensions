import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Wig } from 'shared';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LengthService {
  lengthsResource = httpResource<Array<Wig.Length>>(() => ({
    url: `${environment.url.api}/lengths`,
  }));
}
