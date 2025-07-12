import { DIALOG_DATA, DialogRef } from "@angular/cdk/dialog";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormBuilder, FormsModule } from "@angular/forms";
import {
	LengthService,
	NumberInputComponent,
	SelectComponent,
	type Wig,
} from "shared";

@Component({
	selector: "web-new-wig-length-dialog",
	imports: [FormsModule, SelectComponent, NumberInputComponent],
	templateUrl: "./new-wig-length-dialog.component.html",
	styleUrl: "./new-wig-length-dialog.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewWigLengthDialogComponent {
	private _dialogRef = inject(DialogRef);
	private _fb = inject(FormBuilder);

	dialogData: { price: number; length_id: string; lengths: Array<Wig.Length> } =
		inject(DIALOG_DATA);
}
