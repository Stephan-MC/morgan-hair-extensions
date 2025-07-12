import {
	isPlatformBrowser,
	isPlatformServer,
	NgOptimizedImage,
} from "@angular/common";
import {
	Component,
	ElementRef,
	HostListener,
	inject,
	PLATFORM_ID,
	Renderer2,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { CartStore } from "../../stores/cart.store";
import { BadgeComponent } from "../badge/badge.component";
import {
	animate,
	state,
	style,
	transition,
	trigger,
} from "@angular/animations";
import { ClientStore } from "shared";

@Component({
	selector: "web-navbar",
	imports: [NgOptimizedImage, RouterLink, BadgeComponent],
	templateUrl: "./navbar.component.html",
	styleUrl: "./navbar.component.css",
	animations: [
		trigger("openClose", [
			state(
				"open",
				style({
					height: "*",
					width: "*",
					padding: "*",
				}),
			),
			state(
				"close",
				style({
					padding: 0,
					height: 0,
					width: 0,
				}),
			),
			transition("open <=> close", animate(".3s linear")),
		]),
	],
})
export class NavbarComponent {
	private _renderer = inject(Renderer2);
	private elementRef = inject(ElementRef);
	private platformId = inject(PLATFORM_ID);

	protected readonly cart = inject(CartStore);
	protected readonly client = inject(ClientStore);

	showMobileMenu = false;

	ngAfterViewInit() {
		if (isPlatformBrowser(this.platformId)) {
			const scrollPosition =
				window.scrollY || document.documentElement.scrollTop;

			if (scrollPosition > 10) {
				this._renderer.addClass(this.elementRef.nativeElement, "shadow-2xs!");
				this._renderer.addClass(
					this.elementRef.nativeElement,
					"bg-geyser/50",
					// 'bg-[#d6d6d6]/50!',
				);
				this._renderer.addClass(
					this.elementRef.nativeElement,
					"dark:bg-slate-800/80!",
				);
			}
		}
	}

	@HostListener("window:scroll")
	onWindowScroll(event: Event) {
		const scrollPosition = window.scrollY || document.documentElement.scrollTop;

		if (scrollPosition > 10) {
			this._renderer.addClass(this.elementRef.nativeElement, "shadow-2xs!");
			this._renderer.addClass(
				this.elementRef.nativeElement,
				// 'bg-[#d6d6d6]/50!',
				"bg-geyser/50",
			);
			this._renderer.addClass(
				this.elementRef.nativeElement,
				"dark:bg-slate-800/80!",
			);
		} else {
			this._renderer.removeClass(this.elementRef.nativeElement, "shadow-2xs!");
			this._renderer.removeClass(
				this.elementRef.nativeElement,
				// 'bg-[#d6d6d6]/50!',
				"bg-geyser/50",
			);
			this._renderer.removeClass(
				this.elementRef.nativeElement,
				"dark:bg-slate-800/80!",
			);
		}
	}
}
