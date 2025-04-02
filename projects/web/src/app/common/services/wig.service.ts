import { Injectable } from '@angular/core';
import { WigService as SharedWigService } from 'shared';

@Injectable({
  providedIn: 'root',
})
export class WigService extends SharedWigService {}
