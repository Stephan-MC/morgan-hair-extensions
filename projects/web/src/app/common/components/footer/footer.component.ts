import { Component } from "@angular/core";
import { TextInputComponent } from "shared";

@Component({
	selector: "web-footer",
	imports: [TextInputComponent],
	templateUrl: "./footer.component.html",
	styleUrl: "./footer.component.css",
	host: {
		class: "space-y-12",
	},
})
export class FooterComponent {}
