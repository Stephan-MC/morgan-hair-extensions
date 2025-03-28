import { NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderService, WigService } from 'shared';

@Component({
  selector: 'web-home',
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
})
export class HomePage {
  wigs = inject(WigService).wigsResource;
  orders = inject(OrderService).ordersResource;
}
