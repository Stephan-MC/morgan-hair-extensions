import { Component, input } from "@angular/core";

@Component({
	selector: "web-badge",
	imports: [],
	templateUrl: "./badge.component.html",
	styleUrl: "./badge.component.css",
	host: {
		"[class.hide]": "hide()",
	},
})
export class BadgeComponent {
	value = input<string | number>();

	/** Whether to show badge or not irrespective of value */
	hide = input<boolean>(false);
}
