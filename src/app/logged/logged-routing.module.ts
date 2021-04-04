import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { OverviewComponent, PhotoLibraryComponent } from '@logged/views'

const routes: Routes = [
  {
    path: 'overview',
    component: OverviewComponent
  },
  {
    path: 'photo-library',
    component: PhotoLibraryComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoggedRoutingModule {}
