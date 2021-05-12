import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { LoggedRoutingModule } from '@logged/logged-routing.module'
import { OverviewComponent, PhotoLibraryComponent } from '@logged/views'
import { EffectsModule } from '@ngrx/effects'
import { StoreModule } from '@ngrx/store'
import { SharedModule } from '@shared/shared.module'
import { LoggedFacade } from './facades/logged.facade'
import { LoggedService } from './services/logged.service'
import { LoggedEffects, LoggedReducer, LoggedStoreKey } from './store'
import { VideoStreamComponent } from './views/video-stream/video-stream.component'

@NgModule({
  declarations: [
    OverviewComponent,
    PhotoLibraryComponent,
    VideoStreamComponent
  ],
  imports: [
    CommonModule,
    LoggedRoutingModule,
    SharedModule,
    EffectsModule.forFeature([LoggedEffects]),
    StoreModule.forFeature(LoggedStoreKey, LoggedReducer)
  ],
  providers: [LoggedService, LoggedFacade]
})
export class LoggedModule {}
