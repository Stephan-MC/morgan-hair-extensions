import { Component, inject } from "@angular/core";
import { CartStore } from "../common/stores/cart.store";
import {
	CurrencyPipe,
	NgOptimizedImage,
	ViewportScroller,
} from "@angular/common";
import { NavigationEnd, Router, RouterLink } from "@angular/router";
import {
	ImageComponent,
	NumberInputComponent,
	TextAreaComponent,
	TextInputComponent,
} from "shared";
import { filter, tap } from "rxjs";

@Component({
	selector: "web-cart",
	imports: [
		CurrencyPipe,
		RouterLink,
		ImageComponent,
		NumberInputComponent,
		TextAreaComponent,
		TextInputComponent,
	],
	templateUrl: "./cart.page.html",
	styleUrl: "./cart.page.css",
})
export class CartPage {
	cart = inject(CartStore);

	constructor(
		private _router: Router,
		private viewportScroller: ViewportScroller,
	) {
		this._router.events.pipe(
			filter((ev) => ev instanceof NavigationEnd),
			tap(() => this.viewportScroller.scrollToPosition([0, 0])),
		);
	}

	ngAfterViewInit() {
		this.viewportScroller.scrollToPosition([0, 0]);
	}
}
