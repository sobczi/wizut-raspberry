import { Component, OnDestroy } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { SharedFacade } from '@shared/facades/shared.facade'
import { FormControls } from '@shared/models'
import { DialogService } from '@shared/services'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {
  readonly form: FormGroup

  private readonly unsubscribe$ = new Subject<void>()
  get c (): FormControls {
    return this.form.controls
  }

  constructor (
    private readonly router: Router,
    private readonly facade: SharedFacade,
    private readonly dialogService: DialogService,
    private readonly translateService: TranslateService,
    formsBuilder: FormBuilder
  ) {
    this.form = formsBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })

    this.facade.loginResponse$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => {
        if (response.response) {
          this.dialogService.openSimpleDialog({
            header: 'signedIn',
            content: `${this.translateService.instant('welcome')}, ${
              response.username
            }.`
          })
          this.router.navigate(['/logged/overview'])
          return
        }

        this.dialogService.openSimpleDialog({
          header: 'notLoggedIn',
          content: 'invalidLoginOrPassword'
        })
        this.form.patchValue({ username: '', password: '' })
      })
  }

  ngOnDestroy (): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  handleSubmit (): void {
    if (this.form.invalid) {
      return
    }

    const { username, password } = this.form.value
    this.facade.dispatchLoginRequest(username, password)
  }
}
