import {
	ChangeDetectionStrategy,
	Component,
	inject,
	output,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import { ClientStore, RatingComponent, TextAreaComponent } from "shared";

@Component({
	selector: "web-review-form",
	imports: [
		ReactiveFormsModule,
		TextAreaComponent,
		RatingComponent,
		RouterLink,
		MatButtonModule,
	],
	templateUrl: "./review-form.component.html",
	styleUrl: "./review-form.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewFormComponent {
	private _fb = inject(FormBuilder);
	readonly clientStore = inject(ClientStore);

	form = this._fb.group({
		rating: this._fb.control<number>(0, {
			nonNullable: true,
			validators: [Validators.min(1)],
			updateOn: "change",
		}),
		body: this._fb.control<string>("", {
			nonNullable: true,
			validators: [Validators.minLength(3)],
		}),
	});

	submit = output<{ rating: number; body: string }>();

	handleReview(event: SubmitEvent) {
		event.preventDefault();
		event.stopPropagation();

		if (this.form.valid) {
			this.submit.emit(this.form.getRawValue());
			this.form.reset();
		}
	}
}
