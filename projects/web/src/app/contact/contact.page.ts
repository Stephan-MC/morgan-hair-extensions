import { HttpClient } from "@angular/common/http";
import { Component, DestroyRef, inject } from "@angular/core";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import {
	FormBuilder,
	FormSubmittedEvent,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { asyncScheduler, of, scheduled, timer } from "rxjs";
import {
	catchError,
	delay,
	exhaustMap,
	filter,
	map,
	shareReplay,
	switchMap,
	tap,
	withLatestFrom,
} from "rxjs/operators";
import { Environment, TextAreaComponent, TextInputComponent } from "shared";

@Component({
	selector: "web-contact",
	imports: [ReactiveFormsModule, TextAreaComponent, TextInputComponent],
	templateUrl: "./contact.page.html",
	styleUrl: "./contact.page.css",
})
export class ContactPage {
	private _fb = inject(FormBuilder);
	private _http = inject(HttpClient);
	private _destroyRef = inject(DestroyRef);
	private environment = inject(Environment);
	form = this._fb.group(
		{
			name: this._fb.control("", {
				nonNullable: true,
				validators: [Validators.required, Validators.minLength(3)],
			}),
			email: this._fb.control("", {
				nonNullable: true,
				validators: [
					Validators.required,
					Validators.email,
					Validators.minLength(3),
				],
			}),
			message: this._fb.control("", {
				nonNullable: true,
				validators: [Validators.required, Validators.minLength(3)],
			}),
		},
		{ validators: [Validators.required] },
	);

	response$ = this.form.events.pipe(
		takeUntilDestroyed(this._destroyRef),
		filter((event) => event instanceof FormSubmittedEvent),
		switchMap(() =>
			this._http
				.post(`${this.environment.url.api}/contact`, this.form.getRawValue())
				.pipe(
					exhaustMap(
						() => timer(1000),
						// timer(1000).pipe(tap(() => this.loading.set(false)))
					),
					catchError((error) => {
						console.log("Caught an error");
						return of();
					}),
				),
		),
		catchError((error) => {
			console.log("Caught an error");
			return of();
		}),
		tap(() => this.form.reset()),
		shareReplay(),
	);

	loading = toSignal(
		scheduled(
			this.form.events.pipe(
				filter((event) => event instanceof FormSubmittedEvent),
				map(() => true),
				withLatestFrom(
					this.response$.pipe(
						catchError(() => {
							console.log("We got an error");
							return of(false);
						}),
					),
				),
				tap((data) => console.log(data)),
				map(() => true),
			),
			asyncScheduler,
		),
		{ initialValue: false },
	);

	recentlySuccessful = toSignal(
		this.response$.pipe(
			map(() => true),
			delay(3000),
			// map(() => false)
		),
		{ initialValue: false },
	);
}
