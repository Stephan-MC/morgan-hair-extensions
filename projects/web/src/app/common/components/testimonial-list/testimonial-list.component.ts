import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { TestimonialService } from 'shared';
import { register, SwiperContainer } from 'swiper/element';
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';
import type { SwiperOptions } from 'swiper/types';
import { TestimonialComponent } from '../testimonial/testimonial.component';

@Component({
  selector: 'web-testimonial-list',
  imports: [TestimonialComponent],
  templateUrl: './testimonial-list.component.html',
  styleUrl: './testimonial-list.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestimonialListComponent {
  private _swiperElementRef = viewChild<ElementRef<SwiperContainer>>('swiper');
  private _cdr = inject(ChangeDetectorRef);
  testimonials = inject(TestimonialService).testimonialsResource;

  swiperConfig: SwiperOptions = {
    modules: [EffectCoverflow, Autoplay, Pagination],
    navigation: false,
    pagination: true,
    autoplay: {
      delay: 15500,
      disableOnInteraction: false,
      pauseOnMouseEnter: false,
    },
    effect: 'coverflow',
    coverflowEffect: {
      rotate: 30,
      slideShadows: false,
    },
    loop: true,
    centeredSlides: true,
    grabCursor: true,
    centerInsufficientSlides: true,
    breakpoints: {
      0: {
        slidesPerView: 1.2,
        spaceBetween: 15,
      },
      400: {
        slidesPerView: 1.5,
        spaceBetween: 15,
      },
      520: {
        slidesPerView: 1.8,
        spaceBetween: 20,
      },
      640: {
        slidesPerView: 2.2,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 2.5,
        spaceBetween: 24,
      },
      1024: {
        slidesPerView: 3.1,
        spaceBetween: 24,
      },
    },
  };

  constructor() {
    register();

    effect(() => {
      if (
        this._swiperElementRef()?.nativeElement &&
        !Object.hasOwn(this._swiperElementRef()!.nativeElement, 'passedParams')
      ) {
        Object.assign(
          this._swiperElementRef()!.nativeElement,
          this.swiperConfig,
        );
        this._swiperElementRef()?.nativeElement.initialize();
        console.log(this._swiperElementRef());
        this._cdr.detectChanges();
      }
    });
  }
}
