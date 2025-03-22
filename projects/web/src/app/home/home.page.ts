import { ViewportScroller } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductCardSkeletonComponent } from '../common/components/product-card-skeleton/product-card-skeleton.component';
import { WigCardComponent } from '../common/components/wig-card/wig-card.component';
import { CategoryService } from '../common/services/category.service';
import { WigService } from '../common/services/wig.service';
import { HairTypeService } from '../common/services/wig/hair-type.service';

@Component({
  selector: 'web-home',
  imports: [RouterLink, WigCardComponent, ProductCardSkeletonComponent],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
})
export class HomePage {
  viewPortScroller = inject(ViewportScroller);
  categories = inject(CategoryService).categoryResource;
  hairTypes = inject(HairTypeService).hairTypesResource;
  products = inject(WigService).featuredWigsResource;
}
