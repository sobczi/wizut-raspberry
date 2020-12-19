import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { LoggedGuard } from '@auth/guards'

const routes: Routes = [
  {
    path: 'shared',
    loadChildren: () =>
      import('@shared/shared.module').then(m => m.SharedModule)
  },
  {
    path: 'logged',
    loadChildren: () =>
      import('@logged/logged.module').then(m => m.LoggedModule),
    canActivate: [LoggedGuard]
  },
  {
    path: '**',
    loadChildren: () =>
      import('@shared/shared.module').then(m => m.SharedModule)
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
