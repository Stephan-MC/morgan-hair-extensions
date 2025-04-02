import { Component, forwardRef, input, output } from '@angular/core';
import { InputComponent } from '../input/input.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'number-input',
  imports: [],
  templateUrl: './number-input.component.html',
  styleUrl: './number-input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberInputComponent),
      multi: true,
    },
  ],
  host: {
    '[class.form-input--number]': 'true',
  },
})
export class NumberInputComponent extends InputComponent {
  override _value = input<number>(undefined, { alias: 'value' });
  override type = input<'number'>('number');
  override change = output<number>();
  min = input<number>();
  max = input<number>();
  step = input<number, string | number>(1, {
    transform: (value) => Number(value),
  });

  increment() {
    this.value.update((value) => {
      if (typeof value == 'number' && !Number.isNaN(value)) {
        return Number(value) + this.step();
      }

      return (
        Number(this.inputElementRef()!.nativeElement.value ?? 0) + this.step()
      );
    });
  }

  decrement() {
    this.value.update((value) => {
      if (typeof value == 'number' && !Number.isNaN(value)) {
        return Number(value) - this.step();
      }

      return (
        Number(this.inputElementRef()!.nativeElement.value ?? 0) - this.step()
      );
    });
  }
}
