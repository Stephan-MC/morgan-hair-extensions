import { NgClass } from '@angular/common';
import {
  Component,
  computed,
  effect,
  forwardRef,
  input,
  linkedSignal,
  model,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'rating',
  imports: [NgClass],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css',
  host: {
    class: '"flex gap-px"',
    '(mouseleave)': '!readonly() && hovered.set(0)',
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
  /**
   * Indicates whether the rating is editable by the user
   *
   * @default {true}
   */
  _readonly = input<boolean>(true, { alias: 'readonly' });
  readonly = linkedSignal(() => this._readonly());


  // TODO: Make this input required
  _rating = model<number>(0, { alias: 'rating' })
  rating = linkedSignal(() => this._rating())
  max = input<number, number>(5, { alias: 'max', transform: (value) => value > 0 ? value : 5 })
  stars = computed(() => Array.from({length: this.max()}).map((_, i) => i+1) )
  hovered = signal(0)

  /** The number of stars to be painted */
  star = linkedSignal(() => this.hovered() > 0 ? this.hovered() : this.rating());

  _onChange!: (_: any) => void;
  _onTouched!: VoidFunction;

  change = output<number>();

  constructor() {
    effect(() => {
      if (!this.readonly()) {
        this.change.emit(this.rating());
        this._onTouched();
        this._onChange(this.rating());
      }
    });
  }

  writeValue(value: number): void {
    this.rating.set(Number.isInteger(value) ? value : Number(value));
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

  handleStarClick(n: number) {
    this.rating.update(value => value == n ? 0 : n)
  }
}
