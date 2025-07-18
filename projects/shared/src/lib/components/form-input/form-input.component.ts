import {
	Component,
	ElementRef,
	forwardRef,
	inject,
	input,
	output,
	Renderer2,
	viewChild,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
	selector: "form-input",
	imports: [],
	templateUrl: "./form-input.component.html",
	styleUrl: "./form-input.component.css",
	// changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => FormInputComponent),
			multi: true,
		},
	],
	host: {
		"[class.form-input]": "true",
	},
})
export class FormInputComponent implements ControlValueAccessor {
	private _renderer = inject(Renderer2);
	private _elementRef = inject(ElementRef);
	inputElementRef = viewChild<ElementRef<HTMLInputElement>>("input");

	type = input<InputTypes>("text");
	value = input<string>("");
	change = output<any>();
	placeholder = input<HTMLInputElement["placeholder"]>();
	multiple = input<boolean>(false);
	changeOn = input<"blur" | "input">("input");

	private _onChange!: (_: any) => void;
	private _onTouch: VoidFunction = () => {};

	writeValue(obj: any): void {
		this._renderer.setProperty(
			this.inputElementRef()?.nativeElement,
			"value",
			this.type() == "number" ? Number(obj) : obj,
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
			"disabled",
			isDisabled,
		);
	}

	handleChange(event: Event) {
		if (event.type == "blur") {
			this._onTouch();
		}

		if (
			event.type === this.changeOn() ||
			["radio", "checkbox", "file"].includes(this.type()) ||
			(this.changeOn() === "blur" && event.type === "change")
		) {
			const input = event.target as HTMLInputElement;
			let value;

			switch (this.type()) {
				case "file":
					if (this.multiple()) {
						value = input.files;
					} else {
						value = input.files?.item(0);
					}
					break;

				case "checkbox":
					value = input.checked;
					break;

				default:
					value = input.value;
			}

			this.change.emit(value);
			this._onChange(value);
		}
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
