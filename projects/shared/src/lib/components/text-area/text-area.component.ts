import { Component, forwardRef, input, linkedSignal } from '@angular/core';
import { DefaultValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'text-area',
  imports: [],
  templateUrl: './text-area.component.html',
  styleUrl: './text-area.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextAreaComponent),
      multi: true,
    },
  ],
  host: {
    '[class.form-input]': 'true',
  },
})
export class TextAreaComponent extends DefaultValueAccessor {
  _value = input<string>('', { alias: 'value' });
  value = linkedSignal(() => this._value());
  placeholder = input<string>('');
  label = input<string>();
  rows = input<number>(4);
  cols = input<number>(20);

  override writeValue(value: any): void {
    console.log('setting value to ', value);
    this.value.set(value);
  }
}
