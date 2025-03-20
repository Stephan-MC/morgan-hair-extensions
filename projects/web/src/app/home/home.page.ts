import { ViewportScroller } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ProductCardComponent } from '../common/components/product-card/product-card.component';
import { CategoryService } from '../common/services/category.service';
import { ProductService } from '../common/services/product.service';
import { RouterLink } from '@angular/router';
import { ProductCardSkeletonComponent } from '../common/components/product-card-skeleton/product-card-skeleton.component';
import { WigService } from '../common/services/wig.service';
import { HairTypeService } from '../common/services/wig/hair-type.service';

@Component({
  selector: 'web-home',
  imports: [RouterLink, ProductCardComponent, ProductCardSkeletonComponent],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
})
export class HomePage {
  viewPortScroller = inject(ViewportScroller);
  categories = inject(CategoryService).categoryResource;
  hairTypes = inject(HairTypeService).hairTypesResource;
  products = inject(ProductService).featuredProductsResource;
}
