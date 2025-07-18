import { trigger } from "@angular/animations";
import { isPlatformBrowser, ViewportScroller } from "@angular/common";
import { Component, inject, PLATFORM_ID } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { Meta } from "@angular/platform-browser";
import {
	NavigationCancel,
	NavigationEnd,
	NavigationError,
	NavigationStart,
	Router,
	RouterOutlet,
} from "@angular/router";
import { of, timer } from "rxjs";
import {
	distinctUntilChanged,
	filter,
	map,
	startWith,
	switchMap,
} from "rxjs/operators";
import { ClientStore } from "shared";
import { CartComponent } from "./common/components/cart/cart.component";
import { FooterComponent } from "./common/components/footer/footer.component";
import { NavbarComponent } from "./common/components/navbar/navbar.component";
import { CartStore } from "./common/stores/cart.store";

@Component({
	selector: "web-root",
	imports: [RouterOutlet, NavbarComponent, CartComponent, FooterComponent],
	templateUrl: "./app.component.html",
	styleUrl: "./app.component.css",
	animations: [trigger("loader", [])],
})
export class AppComponent {
	private _router = inject(Router);
	private _platformId = inject(PLATFORM_ID);
	private _viewportScroller = inject(ViewportScroller);
	title = "web";
	cart = inject(CartStore);
	client = inject(ClientStore);

	// Declaratively create the loading signal from router events
	loading = toSignal(
		this._router.events.pipe(
			filter(
				(event) =>
					event instanceof NavigationStart ||
					event instanceof NavigationEnd ||
					event instanceof NavigationCancel ||
					event instanceof NavigationError,
			),
			// Map relevant events to a boolean state
			switchMap((event) => {
				if (event instanceof NavigationStart) {
					// Navigation starts, set loading to true
					return of(true);
				}

				const state = this._router.getCurrentNavigation()?.extras.state;
				if (isPlatformBrowser(this._platformId)) {
					if (state && state["preserveScroll"] === false)
						this._viewportScroller.scrollToPosition([0, 0]);
				}

				return !!state?.["skipLoading"]
					? of(false)
					: timer(1000).pipe(map(() => false));
			}),
			startWith(true), // Start with loading false initially
			distinctUntilChanged(), // Only emit if the loading state actually changes
		),
		// Provide the initial value directly to toSignal as well
		// This is good practice and sometimes required by toSignal depending on setup
		{ initialValue: true },
	);

	constructor(meta: Meta) {
		meta.addTags([{ name: "author", content: "Juliet Morgan" }, {}]);
	}

	ngAfterViewInit() {
		// this.client.login({
		//   email: 'client1@morganhairextensions.localhost',
		//   password: 'password',
		//   remember: true,
		// });
	}
}
