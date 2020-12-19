import { Injectable, OnDestroy } from '@angular/core'
import { Actions, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { takeUntil } from 'rxjs/operators'
import { Observable, Subject } from 'rxjs'

import { AppStore } from '@app/store'
import { LoginRequest, LoginResponse, LogoutRequest } from '@shared/store'
import { LoginResponseArgs } from '@shared/models'

@Injectable()
export class SharedFacade implements OnDestroy {
  readonly loginResponse$: Observable<LoginResponseArgs>

  private readonly unsubscribe$ = new Subject<void>()
  constructor (
    private readonly actions$: Actions,
    private readonly store: Store<AppStore>
  ) {
    this.loginResponse$ = this.actions$.pipe(
      ofType(LoginResponse),
      takeUntil(this.unsubscribe$)
    )
  }

  ngOnDestroy (): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  dispatchLoginRequest (username: string, password: string): void {
    this.store.dispatch(LoginRequest({ username, password }))
  }

  dispatchLogoutRequest (): void {
    this.store.dispatch(LogoutRequest())
  }
}
