import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { LoggedRoutingModule } from '@logged/logged-routing.module'
import { OverviewComponent, PhotoLibraryComponent } from '@logged/views'
import { SharedModule } from '@shared/shared.module'
import { LoggedService } from './services/logged.service'
import { VideoStreamComponent } from './views/video-stream/video-stream.component'

@NgModule({
  declarations: [
    OverviewComponent,
    PhotoLibraryComponent,
    VideoStreamComponent
  ],
  imports: [CommonModule, LoggedRoutingModule, SharedModule],
  providers: [LoggedService]
})
export class LoggedModule {}
