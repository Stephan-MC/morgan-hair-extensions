import { NgOptimizedImage } from '@angular/common';
import { Component, input, linkedSignal } from '@angular/core';
import { Media } from '../../types/media';

@Component({
  selector: 'thumbnail',
  imports: [NgOptimizedImage],
  templateUrl: './image.component.html',
  styleUrl: './image.component.css',
})
export class ImageComponent {
  // _type = input<'preview' | 'default'>('default', { alias: 'type' });
  src = input.required<string, Media | File | string | undefined | null>({
    transform: (src) =>
      typeof src == 'string' && src != ''
        ? src
        : (src as Media)?.url
          ? (src as Media).url
          : src instanceof File
            ? URL.createObjectURL(src)
            : '/assets/images/logo.jpg',
  });
  alt = input<string>();
  priority = input<boolean>(false);

  type = linkedSignal(() =>
    this.src().startsWith('blob:') ? 'preview' : 'default',
  );
}
