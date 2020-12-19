import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { AuthService } from '@auth/services'
import { LoggedGuard, NotLoggedGuard } from '@auth/guards'
import { IsLoggedDirective, IsNotLoggedDirective } from '@auth/directives'

@NgModule({
  declarations: [IsLoggedDirective, IsNotLoggedDirective],
  imports: [CommonModule],
  exports: [IsLoggedDirective, IsNotLoggedDirective],
  providers: [AuthService, LoggedGuard, NotLoggedGuard]
})
export class AuthModule {}
