import { Injectable } from '@angular/core'
import { AuthService } from '@auth/services'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { SharedService } from '@shared/services/shared.service'
import { EMPTY } from 'rxjs'
import { catchError, map, mergeMap } from 'rxjs/operators'
import {
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse
} from './shared.actions'

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
                  key: response
                })
          ),
          catchError(() => EMPTY)
        )
      )
    )
  )

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LogoutRequest),
      mergeMap(() =>
        this.service.logout(this.authService.key).pipe(
          map(() => LogoutResponse()),
          catchError(() => EMPTY)
        )
      )
    )
  )

  constructor (
    private readonly actions$: Actions,
    private readonly service: SharedService,
    private readonly authService: AuthService
  ) {}
}
