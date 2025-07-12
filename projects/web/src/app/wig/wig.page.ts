import {
	CurrencyPipe,
	DecimalPipe,
	ViewportScroller,
	isPlatformBrowser,
} from "@angular/common";
import {
	CUSTOM_ELEMENTS_SCHEMA,
	ChangeDetectorRef,
	Component,
	type ElementRef,
	PLATFORM_ID,
	computed,
	effect,
	inject,
	input,
	linkedSignal,
	viewChild,
} from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { Meta, Title } from "@angular/platform-browser";
import { Router, RouterLink } from "@angular/router";
import { format } from "date-fns";
import {
	debounceTime,
	endWith,
	filter,
	interval,
	scan,
	switchMap,
	takeWhile,
} from "rxjs";
import {
	type Client,
	ClientStore,
	DiscountType,
	ImageComponent,
	NumberInputComponent,
	RatingComponent,
	ReactionType,
	type Wig,
	WigService,
} from "shared";
import { type SwiperContainer, register } from "swiper/element";
import { Autoplay } from "swiper/modules";
import type { SwiperOptions } from "swiper/types";
import { RecommendWigListComponent } from "../common/components/recommend-wig-list/recommend-wig-list.component";
import { ReviewFormComponent } from "../common/components/review-form/review-form.component";
import { ReviewListComponent } from "../common/components/review-list/review-list.component";
import { ProductHelper } from "../common/helpers/product.helper";
import { CartStore } from "../common/stores/cart.store";

@Component({
	selector: "web-wig",
	imports: [
		CurrencyPipe,
		DecimalPipe,
		RouterLink,
		ImageComponent,
		ReviewListComponent,
		RecommendWigListComponent,
		RatingComponent,
		ReviewFormComponent,
		NumberInputComponent,
	],
	templateUrl: "./wig.page.html",
	styleUrl: "./wig.page.css",
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WigPage {
	meta = inject(Meta);
	title = inject(Title);
	private _wigService = inject(WigService);
	private _router = inject(Router);
	private _platformId = inject(PLATFORM_ID);
	private _gallerySwipeElementRef =
		viewChild<
			ElementRef<SwiperContainer & Record<"passedParams", SwiperOptions>>
		>("gallerySwipe");
	private _cdr = inject(ChangeDetectorRef);
	readonly clientStore = inject(ClientStore);
	viewportScroller = inject(ViewportScroller);
	slug = input.required<string>();
	cart = inject(CartStore);
	recommendedWigs = this._wigService.recommended(this.slug);

	wig = this._wigService.wig(this.slug);

	activeThumbnail = linkedSignal(() => this.wig.value()?.thumbnail ?? "");

	wigHelper = computed(() =>
		this.wig.value() ? new ProductHelper(this.wig.value() as Wig) : undefined,
	);
	discountedPrice = toSignal(
		toObservable(this.wig.value).pipe(
			debounceTime(300),
			filter((wig) => !!wig),
			switchMap((wig) =>
				interval(Math.max(50, Math.ceil(500 / wig.length.price))).pipe(
					scan((acc) => (acc > wig.length.price ? acc - 1 : acc + 1), 0),
					takeWhile((price) => Math.abs(wig.length.price - price) > 1),
					endWith(
						wig.discount
							? wig.discount.type === DiscountType.PERCENTAGE
								? ((100 - wig.discount.value) * wig.length.price) / 100
								: wig.length.price - wig?.discount.value
							: wig.length.price,
					),
				),
			),
		),
		{
			initialValue: 0,
		},
	);
	// discountedPrice = linkedSignal(() => {
	// 	if (this.wig.value()) {
	// 		const wig = this.wig.value() as Wig;
	//
	// 		if (wig.discount) {
	// 			return wig.discount.type === DiscountType.PERCENTAGE
	// 				? ((100 - wig.discount.value) * wig.length.price) / 100
	// 				: wig.length.price - wig?.discount.value;
	// 		}
	//
	// 		return wig.length.price;
	// 	}
	//
	// 	return 0;
	// });

	gallerySwipeParams: SwiperOptions = {
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
		slidesPerView: 1,
		breakpoints: {
			0: {
				slidesPerView: 2.7,
				spaceBetween: 5,
				centeredSlides: false,
			},
			400: {
				slidesPerView: 2.1,
				spaceBetween: 15,
			},
			520: {
				slidesPerView: 2.5,
				spaceBetween: 20,
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
		on: {
			transitionStart: (swiper) => {
				const index = swiper.realIndex;

				this.activeThumbnail.set(
					index === 0
						? (this.wig.value()?.thumbnail ?? "")
						: (this.wig.value()?.gallery[index - 1] ?? ""),
				);
			},
		},
	};

	constructor() {
		register();

		effect(() => {
			if (
				isPlatformBrowser(this._platformId) &&
				this._gallerySwipeElementRef()?.nativeElement
			) {
				if (
					!Object.values(
						this._gallerySwipeElementRef()?.nativeElement.passedParams ?? {},
					).length
				) {
					Object.assign(
						this._gallerySwipeElementRef()?.nativeElement ?? {},
						this.gallerySwipeParams,
					);

					this._gallerySwipeElementRef()?.nativeElement.initialize();
					this._cdr.detectChanges();
				}
			}
		});

		effect(() => {
			const wig = this.wig.value();

			if (wig) {
				this.title.setTitle(wig.name);
				this.meta.updateTag({
					name: "keywords",
					content: [
						...wig.name.split(" "),
						"Morgan Hair",
						"Wig",
						wig.color.name,
						wig.texture.name,
						wig.lace.name,
						...wig.lengths.map((l) => l.value),
					].join(", "),
				});
				this.meta.updateTag({
					name: "description",
					content: wig.description,
				});
				this.meta.updateTag({
					property: "og:image",
					content: wig.thumbnail.url,
				});
				this.meta.updateTag({
					property: "og:description",
					content: wig.description,
				});
				this.meta.updateTag({ name: "application-title", content: wig.name });
			}
		});
	}

	selectLength(length: Wig["length"]): void {
		this.wig.update((value) => ({ ...(value as Wig), length }));
	}

	handleReview(payload: { rating: number; body: string }) {
		this.wig.update((wig) => ({
			...(wig as Wig),
			reviews: [
				...(wig?.reviews ?? []),
				{
					id: crypto.randomUUID(),
					client: this.clientStore.client() as Client,
					comment: {
						id: crypto.randomUUID(),
						client: this.clientStore.client() as Client,
						body: payload.body,
						created_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
						updated_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
					},
					reactions: [],
					rating: {
						id: 0,
						rate: payload.rating,
						reacter: {
							reacterable: this.clientStore.client() as Client,
						},
						type: {
							name: ReactionType.RATING,
							mass: 1,
							created_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
							updated_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
						},
						created_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
						updated_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
					},
					created_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
					updated_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
				},
			],
		}));

		this._wigService
			.review((this.wig.value() as Wig).slug, payload)
			.subscribe();
	}
}
