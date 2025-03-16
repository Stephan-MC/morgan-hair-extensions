import { ViewportScroller } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ProductCardComponent } from '../common/components/product-card/product-card.component';
import { CategoryService } from '../common/services/category.service';
import { ProductService } from '../common/services/product.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'web-home',
  imports: [RouterLink, ProductCardComponent],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
})
export class HomePage {
  viewPortScroller = inject(ViewportScroller);
  categories = inject(CategoryService).categoryResource;
  products = inject(ProductService).productsResource;
}
