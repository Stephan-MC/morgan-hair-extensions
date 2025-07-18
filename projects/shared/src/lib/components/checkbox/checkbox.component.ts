import {
	Component,
	ElementRef,
	forwardRef,
	input,
	linkedSignal,
	viewChild,
} from "@angular/core";
import {
	CheckboxControlValueAccessor,
	NG_VALUE_ACCESSOR,
} from "@angular/forms";

@Component({
	selector: "checkbox",
	imports: [],
	templateUrl: "./checkbox.component.html",
	styleUrl: "./checkbox.component.css",
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => CheckboxComponent),
			multi: true,
		},
	],
	host: {
		"[class.form-input]": "true",
	},
})
export class CheckboxComponent extends CheckboxControlValueAccessor {
	label = input<string>();
	_value = input<any>("", { alias: "value" });
	value = linkedSignal(() => this._value());
}
