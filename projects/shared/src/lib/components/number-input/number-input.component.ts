import { Component, forwardRef, input, output } from "@angular/core";
import { InputComponent } from "../input/input.component";
import { NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
	selector: "number-input",
	imports: [],
	templateUrl: "./number-input.component.html",
	styleUrl: "./number-input.component.css",
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => NumberInputComponent),
			multi: true,
		},
	],
	host: {
		"[class.form-input--number]": "true",
	},
})
export class NumberInputComponent extends InputComponent {
	override _value = input<number>(undefined, { alias: "value" });
	override type = input<"number">("number");
	override change = output<number>();
	min = input<number>(Infinity);
	max = input<number>(-Infinity);
	step = input<number, string | number>(1, {
		transform: (value) => Number(value),
	});
	increment = output<number>();
	decrement = output<number>();

	handleIncrement() {
		this.value.update((value) => {
			if (!Number.isNaN(value)) {
				return Math.min(Number(value) + this.step(), this.max());
			}

			return Math.max(
				Number(this.inputElementRef()!.nativeElement.value ?? 0) + this.step(),
				this.max(),
			);
		});

		this.increment.emit(this.value());
	}

	handleDecrement() {
		this.value.update((value) => {
			if (!Number.isNaN(value)) {
				return Math.max(Number(value) - this.step(), this.min());
			}

			return Math.max(
				Number(this.inputElementRef()!.nativeElement.value ?? 0) - this.step(),
				this.min(),
			);
		});

		this.decrement.emit(this.value());
	}
}
