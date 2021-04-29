import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { OverviewComponent, PhotoLibraryComponent } from '@logged/views'
import { VideoStreamComponent } from './views/video-stream/video-stream.component'

const routes: Routes = [
  {
    path: 'overview',
    component: OverviewComponent
  },
  {
    path: 'photo-library',
    component: PhotoLibraryComponent
  },
  {
    path: 'video-stream',
    component: VideoStreamComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoggedRoutingModule {}
