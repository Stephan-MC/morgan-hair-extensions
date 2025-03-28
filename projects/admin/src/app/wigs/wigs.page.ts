import { NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WigService } from 'shared';

@Component({
  selector: 'web-wigs',
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './wigs.page.html',
  styleUrl: './wigs.page.css',
})
export class WigsPage {
  wigs = inject(WigService).wigsResource;
}
