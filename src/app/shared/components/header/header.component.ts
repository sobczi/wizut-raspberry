import { Component } from '@angular/core'
import { SharedFacade } from '@shared/facades/shared.facade'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor (private readonly sharedFacade: SharedFacade) {}

  handleLogout (): void {
    this.sharedFacade.dispatchLogoutRequest()
  }

  handleStream (): void {
    window.location.href = 'https://www.wp.pl'
  }
}
