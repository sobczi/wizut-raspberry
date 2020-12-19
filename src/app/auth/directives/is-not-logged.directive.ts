import {
  Directive,
  OnDestroy,
  TemplateRef,
  ViewContainerRef
} from '@angular/core'
import { takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'

import { AuthService } from '@auth/services'

@Directive({
  selector: '[appIsNotLogged]'
})
export class IsNotLoggedDirective implements OnDestroy {
  private lastLogged = true
  private readonly unsubscribe$ = new Subject<void>()
  constructor (
    templateRef: TemplateRef<any>,
    viewContainer: ViewContainerRef,
    authService: AuthService
  ) {
    authService.username$.pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
      if (!user && this.lastLogged) {
        viewContainer.createEmbeddedView(templateRef)
      } else if (user) {
        viewContainer.clear()
      }
      this.lastLogged = !!user
    })
  }

  ngOnDestroy (): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }
}
