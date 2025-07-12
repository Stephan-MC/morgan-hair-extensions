import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ImageComponent, TextInputComponent, WigService } from "shared";

@Component({
	selector: "web-wigs",
	imports: [ImageComponent, RouterLink, TextInputComponent],
	templateUrl: "./wigs.page.html",
	styleUrl: "./wigs.page.css",
})
export class WigsPage {
	wigs = inject(WigService).wigsResource;
}
