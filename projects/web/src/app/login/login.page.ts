import { NgClass } from "@angular/common";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Component, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import {
	FormBuilder,
	FormSubmittedEvent,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import {
	catchError,
	distinctUntilChanged,
	filter,
	map,
	startWith,
	switchMap,
	tap,
	timer,
} from "rxjs";
import {
	CheckboxComponent,
	ClientStore,
	Environment,
	TextInputComponent,
} from "shared";

@Component({
	selector: "web-login",
	imports: [
		RouterLink,
		TextInputComponent,
		CheckboxComponent,
		ReactiveFormsModule,
		NgClass,
	],
	templateUrl: "./login.page.html",
	styleUrl: "./login.page.css",
})
export class LoginPage {
	private _fb = inject(FormBuilder);
	private _http$ = inject(HttpClient);
	private _router = inject(Router);
	private environment = inject(Environment);
	clientStore = inject(ClientStore);

	form = this._fb.group({
		email: this._fb.control("", {
			nonNullable: true,
			validators: [Validators.required, Validators.email],
		}),
		password: this._fb.control("", {
			nonNullable: true,
			validators: [Validators.required],
		}),
		remember: this._fb.control<boolean>(false, { nonNullable: true }),
	});

	message = signal<string>("");

	loading = toSignal(
		this.form.events.pipe(
			filter((event) => event instanceof FormSubmittedEvent),
			switchMap(() =>
				this.clientStore.login(this.form.getRawValue()).pipe(
					// On successful login, wait 500ms then set loading to false
					switchMap(() => timer(500).pipe(map(() => false))),
					// If an error occurs during login, catch it, log it, and immediately set loading to false
					catchError((error) => {
						if (error instanceof HttpErrorResponse) {
							console.warn(error);
							this.message.set(error.error.message);
						}
						return timer(500).pipe(map(() => false));
					}),
					// Set loading to true as soon as the login request starts
					startWith(true),
				),
			),
			distinctUntilChanged(),
		),
		{
			initialValue: false,
		},
	);
}
