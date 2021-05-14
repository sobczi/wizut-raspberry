import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { FlexLayoutModule } from '@angular/flex-layout'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { MatCardModule } from '@angular/material/card'
import { MatNativeDateModule } from '@angular/material/core'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule, MatIconRegistry } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatTooltipModule } from '@angular/material/tooltip'
import { DomSanitizer } from '@angular/platform-browser'
import { ICONS } from '@assets/constants'
import { AuthModule } from '@auth/auth.module'
import { EffectsModule } from '@ngrx/effects'
import { StoreModule } from '@ngrx/store'
import { TranslateModule } from '@ngx-translate/core'
import { HeaderComponent, SimpleDialogComponent } from '@shared/components'
import { SharedFacade } from '@shared/facades/shared.facade'
import { DialogService, SharedService } from '@shared/services'
import { SharedRoutingModule } from '@shared/shared-routing.module'
import { SharedEffects, SharedReducer, SharedStoreKey } from '@shared/store'
import { HomeComponent, LoginComponent } from '@shared/views'
import { LogoutResolver } from './resolvers/logout.resolver'

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
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    TranslateModule,
    EffectsModule.forFeature([SharedEffects]),
    StoreModule.forFeature(SharedStoreKey, SharedReducer)
  ],
  exports: [
    MatButtonToggleModule,
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
    MatProgressSpinnerModule,
    HomeComponent,
    AuthModule,
    MatDialogModule,
    MatNativeDateModule,
    MatDatepickerModule,
    TranslateModule
  ],
  providers: [SharedService, SharedFacade, DialogService, LogoutResolver]
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
