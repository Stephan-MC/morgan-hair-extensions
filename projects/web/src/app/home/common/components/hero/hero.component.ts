import { ViewportScroller } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ImageComponent } from 'shared';

@Component({
  selector: 'web-hero',
  imports: [ImageComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
})
export class HeroComponent {
  viewportScroller = inject(ViewportScroller);
}
