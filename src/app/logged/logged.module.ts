import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { OverviewComponent } from '@logged/views'
import { LoggedRoutingModule } from '@logged/logged-routing.module'
import { SharedModule } from '@shared/shared.module'

@NgModule({
  declarations: [OverviewComponent],
  imports: [CommonModule, LoggedRoutingModule, SharedModule]
})
export class LoggedModule {}
