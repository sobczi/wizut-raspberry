import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FlexLayoutModule } from '@angular/flex-layout'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { DomSanitizer } from '@angular/platform-browser'
import { HttpClientModule } from '@angular/common/http'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'

import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule, MatIconRegistry } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatDialogModule } from '@angular/material/dialog'

import { HeaderComponent, SimpleDialogComponent } from '@shared/components'
import { LoginComponent, HomeComponent } from '@shared/views'
import { SharedRoutingModule } from '@shared/shared-routing.module'
import { SharedService, DialogService } from '@shared/services'
import { ICONS } from '@assets/constants'
import { AuthModule } from '@auth/auth.module'
import { SharedStoreKey, SharedEffects, SharedReducer } from '@shared/store'
import { SharedFacade } from '@shared/facades/shared.facade'

@NgModule({
  declarations: [
    LoginComponent,
    HeaderComponent,
    HomeComponent,
    SimpleDialogComponent
  ],
  imports: [
    SharedRoutingModule,
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatIconModule,
    HttpClientModule,
    MatTooltipModule,
    AuthModule,
    MatDialogModule,
    EffectsModule.forFeature([SharedEffects]),
    StoreModule.forFeature(SharedStoreKey, SharedReducer)
  ],
  exports: [
    FlexLayoutModule,
    LoginComponent,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    HeaderComponent,
    MatToolbarModule,
    MatIconModule,
    MatTooltipModule,
    HomeComponent,
    AuthModule,
    MatDialogModule
  ],
  providers: [SharedService, SharedFacade, DialogService]
})
export class SharedModule {
  constructor (registry: MatIconRegistry, domSanitizer: DomSanitizer) {
    ICONS.forEach(({ name, path }) =>
      registry.addSvgIcon(
        name,
        domSanitizer.bypassSecurityTrustResourceUrl(path)
      )
    )
  }
}
