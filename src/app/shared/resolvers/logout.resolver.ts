import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router'
import { SharedFacade } from '@shared/facades'

@Injectable()
export class LogoutResolver implements Resolve<void> {
  constructor (private readonly sharedFacade: SharedFacade) {}

  resolve (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): void {
    const logoutKey = 'logout'
    if (!route.queryParamMap.keys.find(e => e === logoutKey)) {
      return
    }

    const takeLogoutAction = route.queryParamMap.get(logoutKey) === 'true'
    if (takeLogoutAction) {
      this.sharedFacade.dispatchLogoutRequest()
    }
  }
}
