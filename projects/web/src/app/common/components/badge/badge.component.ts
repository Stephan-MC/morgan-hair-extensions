import { Component, input } from '@angular/core';

@Component({
  selector: 'web-badge',
  imports: [],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.css',
})
export class BadgeComponent {
  value = input<string | number>();
}
