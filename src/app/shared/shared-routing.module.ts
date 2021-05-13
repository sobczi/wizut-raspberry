import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { NotLoggedGuard } from '@auth/guards'
import { HomeComponent, LoginComponent } from '@shared/views'
import { LogoutResolver } from './resolvers/logout.resolver'

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NotLoggedGuard]
  },
  {
    path: 'homepage',
    component: HomeComponent,
    resolve: {
      redirect: LogoutResolver
    }
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
