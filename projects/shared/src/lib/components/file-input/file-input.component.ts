import { Component, forwardRef, input, output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputComponent } from '../input/input.component';

@Component({
  selector: 'file-input',
  imports: [],
  templateUrl: './file-input.component.html',
  styleUrl: './file-input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileInputComponent),
      multi: true,
    },
  ],
  host: {
    '[class.form-input--file]': 'true',
    '(click)': 'inputElementRef()?.nativeElement.click()',
  },
})
export class FileInputComponent extends InputComponent {
  override type = input<'file'>('file');
  override change = output<File | Array<File>>();

  accept = input<string>();
  capture = input<'user' | 'environment'>();

  override writeValue(_value: any): void {
    return;
  }
}
