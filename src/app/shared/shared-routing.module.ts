import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { HomeComponent, LoginComponent } from '@shared/views'
import { NotLoggedGuard } from '@auth/guards'

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NotLoggedGuard]
  },
  {
    path: 'homepage',
    component: HomeComponent
  },
  {
    path: '**',
    component: HomeComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedRoutingModule {}
