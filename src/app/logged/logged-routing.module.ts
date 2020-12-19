import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { OverviewComponent } from '@logged/views'

const routes: Routes = [
  {
    path: 'overview',
    component: OverviewComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoggedRoutingModule {}
