import { Injectable } from '@angular/core'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'

import { SimpleDialogComponent } from '@shared/components'
import { SimpleDialogData } from '@shared/models'

@Injectable()
export class DialogService {
  private readonly WIDTH = '500px'

  constructor (private readonly dialog: MatDialog) {}

  openSimpleDialog (
    data: SimpleDialogData
  ): MatDialogRef<SimpleDialogComponent> {
    return this.dialog.open(SimpleDialogComponent, {
      data,
      width: this.WIDTH
    })
  }
}
