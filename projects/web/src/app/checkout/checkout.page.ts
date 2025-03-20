import { Component, inject } from '@angular/core';
import { CartStore } from '../common/stores/cart.store';

@Component({
  selector: 'web-checkout',
  imports: [],
  templateUrl: './checkout.page.html',
  styleUrl: './checkout.page.css',
})
export class CheckoutPage {
  cart = inject(CartStore);

  ngOnInit() {
    this.cart.close();
  }
}
