import { Component } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'wizut-raspberry'

  currentLanguage: string

  get languages (): string[] {
    return this.translateService.getLangs()
  }

  constructor (private readonly translateService: TranslateService) {
    translateService.addLangs(['EN', 'PL'])
    translateService.setDefaultLang('EN')
    const browserLang = translateService.getBrowserLang().toUpperCase()
    const currentLanguage = browserLang.match(/EN|PL/) ? browserLang : 'EN'
    this.currentLanguage = currentLanguage
    this.handleLanguageChange()
  }

  handleLanguageChange (): void {
    this.translateService.use(this.currentLanguage)
  }
}
