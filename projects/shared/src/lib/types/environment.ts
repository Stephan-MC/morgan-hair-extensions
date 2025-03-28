import { InjectionToken } from '@angular/core';

export interface Environment extends Record<string, any> {
  url: {
    api: string;
  };
}

export const Environment = new InjectionToken<Environment>('environments');
