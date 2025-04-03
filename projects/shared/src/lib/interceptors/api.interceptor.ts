import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { ClientStore } from '../stores/client.store';
import { isPlatformBrowser } from '@angular/common';
import { DbService } from '../services';
import { AccessToken, PlainTextToken } from '../types';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    var token = '';
    const db = inject(DbService)
      .open({
        name: 'clients',
        version: 1,
        stores: [
          {
            name: 'access_tokens',
            options: { keyPath: ['id', 'tokenable_id'], autoIncrement: true },
          },
        ],
      })
      .then((db) =>
        db
          ?.getAll<{
            accessToken: AccessToken;
            plainTextToken: PlainTextToken;
          }>('client')
          .then((data) => (token = data.at(-1)?.plainTextToken ?? '')),
      );

    if (req.url.match(/http(s?):\/\/api\..*/) && token) {
      return next(
        req.clone({
          headers: req.headers.set('Authorization', 'Bearer ' + token),
        }),
      );
    }
  }

  return next(req);
};
