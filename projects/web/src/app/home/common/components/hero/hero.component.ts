import { ViewportScroller } from "@angular/common";
import { Component, inject } from "@angular/core";

@Component({
	selector: "web-hero",
	imports: [],
	templateUrl: "./hero.component.html",
	styleUrl: "./hero.component.css",
})
export class HeroComponent {
	viewportScroller = inject(ViewportScroller);
}
