import {
  CurrencyPipe,
  DecimalPipe,
  isPlatformBrowser,
  NgOptimizedImage,
  ViewportScroller,
} from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  ElementRef,
  inject,
  input,
  linkedSignal,
  PLATFORM_ID,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { register, SwiperContainer } from 'swiper/element';
import { Autoplay } from 'swiper/modules';
import { SwiperOptions } from 'swiper/types';
import { ProductHelper } from '../common/helpers/product.helper';
import { WigService } from '../common/services/wig.service';
import { CartStore } from '../common/stores/cart.store';
import { DiscountType, ImageComponent, TextAreaComponent, Wig } from 'shared';
import { Meta, Title } from '@angular/platform-browser';
import { ReviewListComponent } from '../common/components/review-list/review-list.component';
import { RecommendWigListComponent } from '../common/components/recommend-wig-list/recommend-wig-list.component';

@Component({
  selector: 'web-wig',
  imports: [
    CurrencyPipe,
    DecimalPipe,
    RouterLink,
    ImageComponent,
    TextAreaComponent,
    ReviewListComponent,
    RecommendWigListComponent,
  ],
  templateUrl: './wig.page.html',
  styleUrl: './wig.page.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WigPage {
  private _wigService = inject(WigService);
  private _platformId = inject(PLATFORM_ID);
  private _gallerySwipeElementRef =
    viewChild<
      ElementRef<SwiperContainer & Record<'passedParams', SwiperOptions>>
    >('gallerySwipe');
  private _cdr = inject(ChangeDetectorRef);
  viewportScroller = inject(ViewportScroller);
  slug = input.required<string>();
  cart = inject(CartStore);
  recommendedWigs = this._wigService.recommended(this.slug);

  wig = this._wigService.wig(this.slug);

  wigHelper = computed(() =>
    this.wig.value() ? new ProductHelper(this.wig.value()!) : undefined,
  );
  discountedPrice = linkedSignal(() => {
    if (this.wig.value()) {
      const wig = this.wig.value()!;

      if (wig.discount) {
        if (wig.discount.type === DiscountType.PERCENTAGE) {
          return ((100 - wig.discount.value) * wig.length.price) / 100;
        } else {
          return wig.length.price - wig.discount.value;
        }
      }

      return wig.length.price;
    }

    return 0;
  });

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
  };

  constructor(meta: Meta, title: Title) {
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
        title.setTitle(wig.name);
        meta.updateTag({
          name: 'keywords',
          content: [
            ...wig.name.split(' '),
            'Morgan Hair',
            'Wig',
            wig.color.name,
            wig.texture.name,
            wig.lace.name,
            ...wig.lengths.map((l) => l.value),
          ].join(', '),
        });
        meta.updateTag({
          name: 'description',
          content: wig.description,
        });
        meta.updateTag({
          property: 'og:image',
          content: wig.thumbnail.url,
        });
        meta.updateTag({
          property: 'og:description',
          content: wig.description,
        });
        meta.updateTag({ name: 'application-title', content: wig.name });
      }
    });
  }

  ngOnInit() {
    if (isPlatformBrowser(this._platformId)) {
      this.viewportScroller.scrollToPosition([0, 0]);
    }
  }

  selectLength(length: Wig['length']): void {
    this.wig.update((value) => ({ ...value!, length }));
  }
}
