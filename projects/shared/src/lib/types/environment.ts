import { InjectionToken } from '@angular/core';

export interface Environment extends Record<string, any> {
  url: {
    api: string;
  };
  production: boolean;
}

export const Environment = new InjectionToken<Environment>('environments', {
  providedIn: 'root',
  factory: () => ({
    url: {
      api: 'http://api.morganhairextensions.com',
    },
    production: true,
  }),
});
