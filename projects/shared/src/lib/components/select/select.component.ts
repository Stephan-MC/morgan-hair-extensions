import {
	Component,
	ElementRef,
	forwardRef,
	input,
	linkedSignal,
	output,
	Renderer2,
	viewChild,
} from "@angular/core";
import { NG_VALUE_ACCESSOR, SelectControlValueAccessor } from "@angular/forms";

@Component({
	selector: "form-select",
	imports: [],
	templateUrl: "./select.component.html",
	styleUrl: "./select.component.css",
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SelectComponent),
			multi: true,
		},
	],
	host: {
		"[class.form-input]": "true",
		"[class.form-input--select]": "true",
	},
})
export class SelectComponent extends SelectControlValueAccessor {
	selectElementRef = viewChild<ElementRef<HTMLSelectElement>>("select");
	private _onChange!: (_: any) => void;
	private _onTouch: VoidFunction = () => {};

	options = input<Array<{ label: string; value: any }> | Array<any>>([]);
	multiple = input<boolean>(false);
	_selected = input<{ label: string; value: any } | any>(undefined, {
		alias: "selected",
	});

	/** use as key to get the label from the option object */
	optionLabel = input<string>("label");

	/** use as key to get the value from the option object */
	optionValue = input<string>("value");

	selected = linkedSignal(() => this._selected() ?? this.options().at(0));
	change = output<any>();

	constructor(renderer: Renderer2, elementRef: ElementRef<HTMLElement>) {
		super(renderer, elementRef);
	}

	handleChange(event: Event) {
		this._onTouch();
		this.change.emit((event.target as HTMLSelectElement).value);
	}

	isSelected(option: any) {
		return (
			option[this.optionLabel()] === this.selected()[this.optionLabel()] &&
			option[this.optionValue()] === this.selected()[this.optionValue()]
		);
	}
}
