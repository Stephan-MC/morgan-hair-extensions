import { Component, forwardRef, input, output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputComponent } from '../input/input.component';

@Component({
  selector: 'text-input',
  imports: [],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInputComponent),
      multi: true,
    },
  ],
  host: {
    '[class.form-input--text]': 'true',
  },
})
export class TextInputComponent extends InputComponent {
  override _value = input<string>('');
  override type = input<'text' | 'email'>('text');
  override change = output<string>();
}
