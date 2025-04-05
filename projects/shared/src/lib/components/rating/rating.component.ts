import { NgClass } from '@angular/common';
import {
  Component,
  effect,
  forwardRef,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'rating',
  imports: [NgClass],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css',
  host: {
    class: '"flex gap-px"',
    '(mouseleave)': '!readonly() && star.set(value())',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RatingComponent),
      multi: true,
    },
  ],
})
export class RatingComponent implements ControlValueAccessor {
  _value = input(0, { alias: 'value' });
  _readonly = input<boolean>(true, { alias: 'readonly' });
  value = linkedSignal(() => this._value());
  readonly = linkedSignal(() => this._readonly());
  star = linkedSignal(() => this.value());

  _onChange!: (_: any) => void;
  _onTouched!: VoidFunction;

  change = output<number>();

  constructor() {
    effect(() => {
      if (!this.readonly()) {
        this.change.emit(this.value());
        this._onTouched();
        this._onChange(this.value());
      }
    });
  }

  writeValue(value: number): void {
    this.star.set(Number.isInteger(value) ? value : Number(value));
  }

  registerOnChange(fn: (_: any) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.readonly.set(isDisabled);
  }
}
