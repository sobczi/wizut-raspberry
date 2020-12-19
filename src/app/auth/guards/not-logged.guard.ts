import { Injectable } from '@angular/core'
import { CanActivate } from '@angular/router'

import { AuthService } from '@auth/services'

@Injectable()
export class NotLoggedGuard implements CanActivate {
  constructor (private readonly service: AuthService) {}

  canActivate (): boolean {
    return !this.service.username
  }
}
