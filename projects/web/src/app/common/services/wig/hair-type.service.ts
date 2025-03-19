import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Wig } from '../../types/wig';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HairTypeService {
  hairTypesResource = httpResource<Array<Wig.HairType>>(() => ({
    url: `${environment.url.api}/hair-types`,
  }));
}
