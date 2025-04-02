import {
  Component,
  effect,
  inject,
  input,
  TemplateRef,
  viewChild,
  viewChildren,
  ViewContainerRef,
} from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { PortalModule, TemplatePortal } from '@angular/cdk/portal';

@Component({
  selector: 'modal',
  imports: [PortalModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  private _viewContainerRef = inject(ViewContainerRef);
  private _dialogData = inject(DIALOG_DATA);

  open = input<boolean>(false);
  portalContent = viewChild<TemplateRef<unknown>>('template');

  portal!: TemplatePortal<any>;

  constructor() {
    effect(() => {
      if (this.open()) {
      }
    });
  }

  ngAfterViewInit() {
    this.portal = new TemplatePortal(
      this.portalContent()!.elementRef,
      this._viewContainerRef,
    );
  }
}
