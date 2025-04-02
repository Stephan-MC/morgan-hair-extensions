import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { LengthService, SelectComponent } from 'shared';
import { Length } from '../../../../../../../shared/src/lib/types/wig/length';

@Component({
  selector: 'web-new-wig-length-dialog',
  imports: [FormsModule, SelectComponent],
  templateUrl: './new-wig-length-dialog.component.html',
  styleUrl: './new-wig-length-dialog.component.css',
})
export class NewWigLengthDialogComponent {
  private _dialogRef = inject(DialogRef);
  private _fb = inject(FormBuilder);
  lengths = inject(LengthService).lengthsResource;

  dialogData: { price: number; length_id: string; lengths: Array<Length> } =
    inject(DIALOG_DATA);
}
