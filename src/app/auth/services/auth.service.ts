import { Injectable, OnDestroy } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Actions, ofType } from '@ngrx/effects'
import { Router } from '@angular/router'
import { filter, takeUntil } from 'rxjs/operators'
import { ReplaySubject, Subject } from 'rxjs'

import { SharedFacade } from '@shared/facades'
import { DialogService } from '@shared/services'
import { LogoutRequest } from '@shared/store'

@Injectable()
export class AuthService implements OnDestroy {
  readonly username$ = new ReplaySubject<string>()

  private _username: string
  private _access: string
  private _refresh: string

  private readonly USERNAME_STORAGE = 'USERNAME'
  private readonly ACCESS_STORAGE = 'ACCESS'
  private readonly REFRESH_STORAGE = 'REFRESH'
  private readonly unsubscribe$ = new Subject<void>()
  get username (): string {
    return this._username
  }

  constructor (
    private readonly router: Router,
    private readonly actions$: Actions,
    private readonly dialogRef: MatDialog,
    private readonly dialogService: DialogService,
    private readonly sharedFacade: SharedFacade
  ) {
    this._username = sessionStorage.getItem(this.USERNAME_STORAGE)
    this._access = sessionStorage.getItem(this.ACCESS_STORAGE)
    this._refresh = sessionStorage.getItem(this.REFRESH_STORAGE)
    this.username$.next(this._username)

    this.sharedFacade.loginResponse$
      .pipe(
        takeUntil(this.unsubscribe$),
        filter(r => !!r.response)
      )
      .subscribe(({ username, access, refresh }) => {
        this._username = username
        this._access = access
        this._refresh = refresh

        sessionStorage.setItem(this.USERNAME_STORAGE, username)
        sessionStorage.setItem(this.ACCESS_STORAGE, access)
        sessionStorage.setItem(this.REFRESH_STORAGE, refresh)

        this.username$.next(this._username)
      })

    this.actions$
      .pipe(ofType(LogoutRequest), takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.dialogRef.closeAll()
        this.dialogService.openSimpleDialog({
          header: 'Wylogowano',
          content: `Żegnaj, ${this._username}.`
        })
        delete this._username
        delete this._access
        delete this._refresh

        sessionStorage.clear()

        this.username$.next()

        this.router.navigate(['/shared/home'])
      })
  }

  ngOnDestroy (): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }
}
