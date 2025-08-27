import { Component, inject } from "@angular/core";
import { MatDialogRef, MatDialogContent } from "@angular/material/dialog";
import { MatDialogActions } from "@angular/material/dialog";

@Component({
	selector: "web-quick-login",
	imports: [MatDialogContent, MatDialogActions],
	templateUrl: "./quick-login.component.ng.html",
	styleUrl: "./quick-login.component.css",
})
export class QuickLoginComponent {
	readonly dialogRef = inject(MatDialogRef<QuickLoginComponent>);
}
