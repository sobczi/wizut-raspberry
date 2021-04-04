import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { LoggedRoutingModule } from '@logged/logged-routing.module'
import { OverviewComponent, PhotoLibraryComponent } from '@logged/views'
import { SharedModule } from '@shared/shared.module'

@NgModule({
  declarations: [OverviewComponent, PhotoLibraryComponent],
  imports: [CommonModule, LoggedRoutingModule, SharedModule]
})
export class LoggedModule {}
