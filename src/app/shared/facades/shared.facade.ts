import { Injectable, OnDestroy } from '@angular/core'
import { AppStore } from '@app/store'
import { Actions, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { LoginResponseArgs } from '@shared/models'
import { LoginRequest, LoginResponse, LogoutRequest } from '@shared/store'
import { Observable, Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

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
    this.store.dispatch(LogoutRequest({ key: sessionStorage.getItem('KEY') }))
  }
}
