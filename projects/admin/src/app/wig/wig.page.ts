import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  linkedSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EMPTY, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
  ColorService,
  FileInputComponent,
  FormInputComponent,
  HairTypeService,
  ImageComponent,
  LengthService,
  Media,
  MediaService,
  NumberInputComponent,
  SelectComponent,
  SourceService,
  TextInputComponent,
  Wig,
  WigService,
} from 'shared';

@Component({
  selector: 'web-wig',
  imports: [
    ReactiveFormsModule,
    TextInputComponent,
    FileInputComponent,
    FormInputComponent,
    SelectComponent,
    NumberInputComponent,
    ImageComponent,
  ],
  templateUrl: './wig.page.html',
  styleUrl: './wig.page.css',
})
export class WigPage {
  private _fb = inject(FormBuilder);
  private _wigService = inject(WigService);
  private _mediaService = inject(MediaService);
  private _destroyRef = inject(DestroyRef);
  slug = input.required<Wig['slug']>();
  wig = this._wigService.wig(this.slug);

  thumbnail = linkedSignal<File | Media | undefined>(
    () => this.wig.value()?.thumbnail,
  );
  gallery = linkedSignal(() => this.wig.value()?.gallery ?? []);

  form = this._fb.group({
    name: this._fb.control<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    description: this._fb.control<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(20)],
    }),
    thumbnail: this._fb.control<File | undefined>(undefined, {
      nonNullable: true,
    }),
    gallery: this._fb.array<Array<File | Media>>([], { validators: [] }),
    length_id: this._fb.control<string>('', {
      nonNullable: true,
    }),
    source_id: this._fb.control<string>('', {
      nonNullable: true,
    }),
    hair_type_id: this._fb.control<string>('', {
      nonNullable: true,
    }),
    featured: this._fb.control<boolean>(false, { nonNullable: true }),
    stock: this._fb.control<number>(1, {
      nonNullable: true,
      validators: [Validators.min(0)],
    }),
    price: this._fb.control<number>(0.0, { nonNullable: true }),
  });

  lengths = inject(LengthService).lengthsResource;
  hairTypes = inject(HairTypeService).hairTypesResources;
  sources = inject(SourceService).sourcesResource;
  colors = inject(ColorService).colorsResource;

  constructor() {
    effect(() => {
      if (this.wig.value()) {
        const wig = this.wig.value();

        this.form.patchValue({
          name: wig?.name,
          description: wig?.description,
          price: wig?.price,
          stock: wig?.stock,
          length_id: wig?.length.id,
          source_id: wig?.source.id,
          hair_type_id: wig?.hair_type.id,
        });
      }
    });

    this.form.controls.thumbnail.valueChanges
      .pipe(takeUntilDestroyed(), tap(this.thumbnail.set))
      .subscribe();
  }

  handleSubmit() {
    if (this.form.invalid) {
      return;
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

  removeImageFromGallery(id: Media['id']) {
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
}
