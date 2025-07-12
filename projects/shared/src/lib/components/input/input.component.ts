import {
  Component,
  effect,
  ElementRef,
  forwardRef,
  inject,
  input,
  linkedSignal,
  output,
  Renderer2,
  viewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
} from '@angular/forms';

/**
 * @protected void handleChange()
 */
@Component({
  selector: 'input',
  imports: [],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  host: {
    '[class.form-input]': 'true',
  },
})
export class InputComponent implements ControlValueAccessor {
  private _renderer = inject(Renderer2);
  private _elementRef = inject(ElementRef);
  inputElementRef = viewChild<ElementRef<HTMLInputElement>>('input');

  type = input<any>('text');
  _value = input<any>('', { alias: 'value' });
  change = output<any>();
  placeholder = input<HTMLInputElement['placeholder']>();
  multiple = input<boolean>(false);
  changeOn = input<'blur' | 'input'>('input');
  readonly = input<boolean>(false);

  value = linkedSignal(() => this._value());

  private _onChange: (_: any) => void = (_: any) => {};
  private _onTouch: VoidFunction = () => {};

  constructor() {
    effect(() => {
      if (!['file'].includes(this.type()))
        this._renderer.setProperty(
          this.inputElementRef()?.nativeElement,
          this.type() == 'checkbox' ? 'checked' : 'value',
          this.value(),
        );

      this._onChange(this.value());
      this.change.emit(this.value());
    });
  }

  writeValue(value: any): void {
    if (this.type() == 'number' && !value) return;

    this._renderer.setProperty(
      this.inputElementRef()?.nativeElement,
      ['checkbox', 'radio'].includes(this.type()) ? 'checked' : 'value',
      value,
    );
  }

  registerOnChange(fn: (_: any) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: VoidFunction): void {
    this._onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._renderer.setProperty(
      this._elementRef.nativeElement,
      'disabled',
      isDisabled,
    );
  }

  handleChange(event: Event) {
    if (event.type == 'input') {
      this._onTouch();
    }

    if (
      event.type === this.changeOn() ||
      ['radio', 'checkbox', 'file'].includes(this.type()) ||
      (this.changeOn() === 'blur' && event.type === 'change')
    ) {
      const input = event.target as HTMLInputElement;
      let value;

      switch (this.type()) {
        case 'file':
          this.value.set(this.multiple() ? input.files : input.files?.item(0));
          break;

        case 'checkbox':
          this.value.set(input.checked);
          break;

        default:
          this.value.set(input.value);
      }
    }
  }
}
