import { NgOptimizedImage, ViewportScroller } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductCardSkeletonComponent } from '../common/components/product-card-skeleton/product-card-skeleton.component';
import { WigCardComponent } from '../common/components/wig-card/wig-card.component';
import { WigService } from '../common/services/wig.service';
import { HairTypeService } from '../common/services/wig/hair-type.service';

@Component({
  selector: 'web-home',
  imports: [
    NgOptimizedImage,
    RouterLink,
    WigCardComponent,
    ProductCardSkeletonComponent,
  ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
})
export class HomePage {
  viewPortScroller = inject(ViewportScroller);
  hairTypes = inject(HairTypeService).hairTypesResource;
  products = inject(WigService).featuredWigsResource;
}
