import { Component, effect, forwardRef, input, output } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { InputComponent } from "../input/input.component";

@Component({
	selector: "text-input",
	imports: [],
	templateUrl: "./text-input.component.html",
	styleUrl: "./text-input.component.css",
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => TextInputComponent),
			multi: true,
		},
	],
	host: {
		"[class.form-input]": "true",
	},
})
export class TextInputComponent extends InputComponent {
	override _value = input<string>("");
	override type = input<InputTypes>("text");
	override change = output<string>();
	input = output<string>();
	label = input<string>();

	constructor() {
		super();

		effect(() => {
			this.input.emit(this.value());
		});
	}
}

type InputTypes =
	| "text"
	| "number"
	| "file"
	| "radio"
	| "checkbox"
	| "email"
	| string;
