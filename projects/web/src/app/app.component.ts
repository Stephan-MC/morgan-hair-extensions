import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './common/components/navbar/navbar.component';
import { CartComponent } from './common/components/cart/cart.component';
import { CartStore } from './common/stores/cart.store';
import { Meta } from '@angular/platform-browser';
import { ClientStore } from 'shared';
import { FooterComponent } from './common/components/footer/footer.component';

@Component({
  selector: 'web-root',
  imports: [RouterOutlet, NavbarComponent, CartComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'web';
  cart = inject(CartStore);
  client = inject(ClientStore);

  constructor(meta: Meta) {
    meta.addTag({ name: 'author', content: 'Juliet Morgan' });
  }

  ngAfterViewInit() {
    this.client.login({
      email: 'client1@morganhairextensions.localhost',
      password: 'password',
      remember: true,
    });
  }
}
