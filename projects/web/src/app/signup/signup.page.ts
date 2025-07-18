import { HttpClient } from "@angular/common/http";
import { Component, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import {
	FormBuilder,
	FormSubmittedEvent,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { RouterLink } from "@angular/router";
import { endWith, filter, map, startWith, switchMap, tap, timer } from "rxjs";
import {
	ClientStore,
	CookieService,
	Environment,
	TextInputComponent,
} from "shared";

@Component({
	selector: "web-signup",
	imports: [RouterLink, TextInputComponent, ReactiveFormsModule],
	templateUrl: "./signup.page.html",
	styleUrl: "./signup.page.css",
})
export class SignupPage {
	private _environment = inject(Environment);
	private _fb = inject(FormBuilder);
	private _http$ = inject(HttpClient);
	private clientStore = inject(ClientStore);
	private _cookie = inject(CookieService);

	form = this._fb.group({
		first_name: this._fb.control("", {
			nonNullable: true,
			validators: [Validators.required, Validators.minLength(3)],
		}),
		last_name: this._fb.control("", {
			nonNullable: true,
			validators: [Validators.required, Validators.minLength(3)],
		}),
		email: this._fb.control("", {
			nonNullable: true,
			validators: [Validators.required, Validators.email],
		}),
		password: this._fb.control("", {
			nonNullable: true,
			validators: [Validators.required, Validators.minLength(8)],
		}),
		password_confirmation: this._fb.control("", {
			nonNullable: true,
			validators: [Validators.required],
		}),
	});

	message = signal<string>("");

	loading = toSignal(
		this.form.events.pipe(
			startWith(false),
			filter((event) => event instanceof FormSubmittedEvent),
			switchMap(() =>
				this.clientStore.signup(this.form.getRawValue()).pipe(
					startWith(true),
					switchMap(() => timer(1000).pipe(map(() => false))),
					tap(() => console.log("No issue")),
					endWith(false),
				),
			),
			tap(() => console.log("Form submitted")),
		),
		{
			initialValue: false,
			requireSync: false,
		},
	);
}
