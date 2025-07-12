import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { ClientStore } from '../stores/client.store';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { DbService } from '../services';
import { AccessToken, PlainTextToken } from '../types';
import { EMPTY, from } from 'rxjs';
import { catchError, filter, switchMap, tap } from 'rxjs/operators';
import { HTTP_SKIP_ON_SERVER } from '../http';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const dbService = inject(DbService);

  if (isPlatformServer(platformId) && req.context.get(HTTP_SKIP_ON_SERVER)) {
    return EMPTY
  }

  if (isPlatformBrowser(platformId) && req.url.match(/^http(s?):\/\/api\./)) {
    return from(
      dbService.open({
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
          }>('access_tokens')
          .then((data) =>
            String(data.at(-1)?.plainTextToken)
          )
      )
    ).pipe(
        switchMap(token => !!token ? next(
          req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + token),
          })
        ) : next(req)),
        catchError((error: HttpErrorResponse) => {
          if (error.status == 401) {
            // TODO: Delete client data
          }

          return EMPTY
        })
      )
  }

  return next(req);
};
