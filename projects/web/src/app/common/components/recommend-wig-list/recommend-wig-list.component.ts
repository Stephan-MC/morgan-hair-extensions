import { ViewportScroller } from "@angular/common";
import {
	CUSTOM_ELEMENTS_SCHEMA,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	type ElementRef,
	PLATFORM_ID,
	effect,
	inject,
	input,
	viewChild,
} from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { ImageComponent, type Wig } from "shared";
import { type SwiperContainer, register } from "swiper/element";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import type { SwiperOptions } from "swiper/types";

@Component({
	selector: "web-recommend-wig-list",
	imports: [RouterLink, ImageComponent],
	templateUrl: "./recommend-wig-list.component.html",
	styleUrl: "./recommend-wig-list.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	host: {
		ngSkipHydration: "true",
	},
})
export class RecommendWigListComponent {
	private _platformId = inject(PLATFORM_ID);
	private _router = inject(Router);
	private _cdr = inject(ChangeDetectorRef);

	wigs = input.required<Array<Wig>>();
	viewportScroller = inject(ViewportScroller);

	private _swiperElementRef =
		viewChild<
			ElementRef<SwiperContainer & Record<"passedParams", SwiperOptions>>
		>("swiper");
	swiperParams: SwiperOptions = {
		modules: [Autoplay],
		navigation: false,
		pagination: false,
		autoplay: {
			delay: 4500,
			disableOnInteraction: false,
			pauseOnMouseEnter: false,
		},
		loop: true,
		centeredSlides: true,
		spaceBetween: 5,
		slidesPerView: 1.5,
		breakpoints: {
			400: {
				slidesPerView: 2.1,
				spaceBetween: 10,
			},
			520: {
				slidesPerView: 2.5,
				spaceBetween: 20,
				effect: "none",
			},
			768: {
				slidesPerView: 3.4,
				spaceBetween: 24,
			},
			1280: {
				slidesPerView: 3.8,
				spaceBetween: 33,
			},
		},
	};

	constructor() {
		register();

		effect(() => {
			if (this._swiperElementRef()?.nativeElement) {
				if (
					!Object.values(
						this._swiperElementRef()?.nativeElement.passedParams ?? {},
					).length
				) {
					Object.assign(
						this._swiperElementRef()?.nativeElement ?? {},
						this.swiperParams,
					);

					this._swiperElementRef()?.nativeElement.initialize();
					this._cdr.detectChanges();
				}
			}
		});
	}

	navigateToWig(event: Event, slug: Wig["slug"]) {
		this.viewportScroller.scrollToPosition([0, 0]);
	}
}
