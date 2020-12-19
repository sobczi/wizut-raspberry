import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, map, mergeMap } from 'rxjs/operators'
import { EMPTY } from 'rxjs'

import { SharedService } from '@shared/services/shared.service'

import { LoginRequest, LoginResponse } from './shared.actions'

@Injectable()
export class SharedEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoginRequest),
      mergeMap(({ username, password }) =>
        this.service.login(username, password).pipe(
          map(response =>
            typeof response === 'boolean'
              ? LoginResponse({ response })
              : LoginResponse({
                  response: true,
                  username,
                  refresh: response.refresh,
                  access: response.access
                })
          ),
          catchError(() => EMPTY)
        )
      )
    )
  )

  constructor (
    private readonly actions$: Actions,
    private readonly service: SharedService
  ) {}
}
