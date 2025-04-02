import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './common/components/navbar/navbar.component';
import { CartComponent } from './common/components/cart/cart.component';
import { CartStore } from './common/stores/cart.store';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'web-root',
  imports: [RouterOutlet, NavbarComponent, CartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'web';
  cart = inject(CartStore);

  constructor(meta: Meta) {
    meta.addTag({ name: 'author', content: 'Juliet Morgan' });
  }
}
