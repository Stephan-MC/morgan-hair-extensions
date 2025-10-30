import { Component } from "@angular/core";
import { TextInputComponent } from "shared";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";

@Component({
	selector: "web-footer",
	imports: [TextInputComponent, MatInputModule],
	templateUrl: "./footer.component.html",
	styleUrl: "./footer.component.css",
	host: {
		class: "space-y-12",
	},
})
export class FooterComponent {}
