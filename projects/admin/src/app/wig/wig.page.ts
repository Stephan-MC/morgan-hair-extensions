import { Dialog, DialogModule } from "@angular/cdk/dialog";
import { Overlay } from "@angular/cdk/overlay";
import { CurrencyPipe, KeyValuePipe, NgTemplateOutlet } from "@angular/common";
import {
	Component,
	DestroyRef,
	effect,
	inject,
	input,
	linkedSignal,
} from "@angular/core";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import {
	FormBuilder,
	FormControl,
	FormRecord,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { EMPTY, Observable } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import {
	ColorService,
	FileInputComponent,
	FormInputComponent,
	HairTypeService,
	ImageComponent,
	LaceService,
	LengthService,
	Media,
	MediaService,
	NumberInputComponent,
	SelectComponent,
	SourceService,
	TextAreaComponent,
	TextInputComponent,
	TextureService,
	Wig,
	WigService,
} from "shared";
import { NewWigLengthDialogComponent } from "./common/dialogs/new-wig-length-dialog/new-wig-length-dialog.component";

@Component({
	selector: "web-wig",
	imports: [
		CurrencyPipe,
		DialogModule,
		KeyValuePipe,
		ReactiveFormsModule,
		TextInputComponent,
		TextAreaComponent,
		FileInputComponent,
		SelectComponent,
		NumberInputComponent,
		ImageComponent,
	],
	templateUrl: "./wig.page.html",
	styleUrl: "./wig.page.css",
})
export class WigPage {
	private _fb = inject(FormBuilder);
	private _wigService = inject(WigService);
	private _mediaService = inject(MediaService);
	private _destroyRef = inject(DestroyRef);
	private _overlay = inject(Overlay);
	private _dialog = inject(Dialog);

	slug = input.required<Wig["slug"]>();
	wig = this._wigService.wig(this.slug);

	thumbnail = linkedSignal<File | Media | undefined>(
		() => this.wig.value()?.thumbnail,
	);
	gallery = linkedSignal(() => this.wig.value()?.gallery ?? []);

	form = this._fb.group({
		name: this._fb.control<string>("", {
			nonNullable: true,
			validators: [Validators.required, Validators.minLength(3)],
		}),
		description: this._fb.control<string>("", {
			nonNullable: true,
			validators: [Validators.required, Validators.minLength(20)],
		}),
		thumbnail: this._fb.control<File | undefined>(undefined, {
			nonNullable: true,
		}),
		gallery: this._fb.array<Array<File | Media>>([], { validators: [] }),
		length_id: this._fb.control<string>("", {
			nonNullable: true,
		}),
		lengths: this._fb.record<FormRecord<FormControl<number>>>(
			{},
			{ validators: [Validators.required, Validators.minLength(1)] },
		),
		source_id: this._fb.control<string>("", {
			nonNullable: true,
		}),
		color_id: this._fb.control<string>("", {
			nonNullable: true,
		}),
		texture_id: this._fb.control<string>("", {
			nonNullable: true,
		}),
		lace_id: this._fb.control<string>("", {
			nonNullable: true,
		}),
		hair_type_id: this._fb.control<string>("", {
			nonNullable: true,
		}),
		featured: this._fb.control<boolean>(false, { nonNullable: true }),
		stock: this._fb.control<number>(1, {
			nonNullable: true,
			validators: [Validators.min(0)],
		}),
	});

	lengths = inject(LengthService).lengthsResource;
	textures = inject(TextureService).texturesResource;
	hairTypes = inject(HairTypeService).hairTypesResource;
	sources = inject(SourceService).sourcesResource;
	colors = inject(ColorService).colorsResource;
	laces = inject(LaceService).lacesResource;

	color$ = toSignal(
		this.form.controls.color_id.valueChanges.pipe(
			map((id) => this.colors.value()?.find((color) => color.id === id)?.name),
		),
	);

	constructor() {
		effect(() => {
			if (this.wig.hasValue() && !!this.wig.value()) {
				const wig = this.wig.value()!;

				this.form.patchValue({
					name: wig?.name,
					description: wig?.description,
					stock: wig?.stock,
					color_id: wig.color.id,
					lace_id: wig.lace.id,
					texture_id: wig.texture.id,
					length_id: wig?.length.id,
					source_id: wig?.source.id,
					hair_type_id: wig?.hair_type.id,
				});

				wig.lengths.forEach((length) =>
					this.form.controls.lengths.addControl(
						length.id,
						this._fb.record({
							price: this._fb.control(length.price, {
								nonNullable: true,
								validators: [Validators.required, Validators.min(10)],
							}),
						}),
					),
				);
			}
		});

		this.form.controls.thumbnail.valueChanges
			.pipe(takeUntilDestroyed(), tap(this.thumbnail.set))
			.subscribe();
	}

	handleSubmit() {
		if (this.form.invalid) {
			// return;
		}

		var observer: Observable<any>;

		if (this.slug()) {
			observer = this._wigService
				.updateWig(this.wig.value()!.slug, this.form)
				.pipe(tap(() => this.wig.reload()));
		} else {
			observer = this._wigService.create(this.form).pipe(tap());
		}

		observer
			.pipe(
				catchError((response) => {
					const errors = response.error.errors as Record<
						keyof typeof this.form.controls,
						[string]
					>;

					for (const [k, value] of Object.entries(errors)) {
						const key = k as keyof typeof this.form.controls;
						const control = this.form.controls[key];

						if (control) {
							control.setErrors({ [key]: value[0] });
						} else {
							this.form.setErrors({ [key]: value[0] });
						}
					}

					return EMPTY;
				}),
			)
			.subscribe();
	}

	handleGalleryChange(event: Event) {
		const files = (event.target as HTMLInputElement).files;

		if (files != null) {
			Array.from(files).forEach((file) => {
				this.form.controls.gallery.push(this._fb.control(file));
			});
		}
	}

	removeImageFromGallery(id: Media["id"]) {
		// TODO: write functionality to delete media and detach from model
		this._mediaService
			.detach(this.wig.value()!.slug, id)
			.pipe(
				takeUntilDestroyed(this._destroyRef),
				tap(() =>
					this.gallery.update((values) =>
						values.filter((value) => value.id !== id),
					),
				),
			)
			.subscribe();
	}

	find(id: Wig.Length["id"]) {
		return (l: Wig.Length) => l.id == id;
	}

	openNewLengthDialog() {
		const dialogRef = this._dialog.open<{ price: number; length_id: string }>(
			NewWigLengthDialogComponent,
			{
				positionStrategy: this._overlay
					.position()
					.global()
					.centerVertically()
					.centerHorizontally(),
				data: {
					price: 0,
					length_id: "",
					lengths: this.lengths
						.value()
						.filter(
							(length) => !this.form.controls.lengths.getRawValue()[length.id],
						),
				},
			},
		);

		dialogRef.closed
			.pipe(
				tap((value) => {
					if (Number(value?.price) > 0 && value?.length_id) {
						this.form.controls.lengths.addControl(
							value.length_id,
							this._fb.record({
								price: this._fb.control(value.price, {
									nonNullable: true,
									validators: [Validators.required, Validators.min(10)],
								}),
							}),
						);
					}
				}),
				takeUntilDestroyed(this._destroyRef),
			)
			.subscribe();
	}
}
