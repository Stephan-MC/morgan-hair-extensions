import {
	animate,
	state,
	style,
	transition,
	trigger,
} from "@angular/animations";
import { ViewportScroller } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	inject,
	input,
	linkedSignal,
	output,
} from "@angular/core";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import {
	FormControl,
	PristineChangeEvent,
	ReactiveFormsModule,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatChipsModule } from "@angular/material/chips";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { EMPTY } from "rxjs";
import {
	debounceTime,
	distinctUntilChanged,
	exhaustMap,
	filter,
	map,
	tap,
	withLatestFrom,
} from "rxjs/operators";
import { HairTypeService, TextInputComponent } from "shared";
import { WigService } from "../../services/wig.service";
import { ColorService } from "../../services/wig/color.service";
import { LaceService } from "../../services/wig/lace.service";
import { LengthService } from "../../services/wig/length.service";
import { SourceService } from "../../services/wig/source.service";
import { TextureService } from "../../services/wig/texture.service";

@Component({
	selector: "web-shop-filter",
	imports: [
		ReactiveFormsModule,
		TextInputComponent,
		RouterLink,
		MatChipsModule,
		MatButtonModule,
	],
	templateUrl: "./shop-filter.component.html",
	styleUrl: "./shop-filter.component.css",
	animations: [
		trigger("openClose", [
			state(
				"open",
				style({
					height: "*",
					width: "*",
				}),
			),
			state(
				"close",
				style({
					height: "calc(var(--spacing) * 10)",
					width: "calc(var(--spacing) * 30)",
				}),
			),
			transition("open => close", animate("0.3s linear")),
			transition("close => open", animate("0.3s linear")),
		]),
	],
	host: {
		"[@openClose]": 'show() ? "open" : "close"',
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopFilterComponent {
	private _wigService = inject(WigService);
	readonly router = inject(Router);
	readonly route = inject(ActivatedRoute);
	protected viewportScroller = inject(ViewportScroller);

	open = input(false);

	_open = output({ alias: "open" });
	_close = output({ alias: "close" });

	colors = inject(ColorService).colorsResource;
	laces = inject(LaceService).lacesResource;
	sources = inject(SourceService).sourcesResource;
	hairTypes = inject(HairTypeService).hairTypesResource;
	lengths = inject(LengthService).lengthsResource;
	textures = inject(TextureService).texturesResource;
	queryParams = toSignal(this.route.queryParams.pipe(), {
		initialValue: {} as Record<string, string | undefined>,
	});
	q = new FormControl(this.route.snapshot.queryParamMap.get("q"));
	show = linkedSignal(() => this.open());

	constructor() {
		this.route.queryParams.pipe(
			tap((params) => {
				console.log("tapping q", params["q"]);
				// this.q.setValue(params["q"] ?? "", {});
			}),
		);

		this.q.valueChanges
			.pipe(
				takeUntilDestroyed(),
				tap(() => console.log("Constructor -> watching for changes")),
				debounceTime(800),
				map((value) => (value?.length ? value?.trim() : undefined)),
				distinctUntilChanged(),
				withLatestFrom(
					this.q.events.pipe(filter((ev) => ev instanceof PristineChangeEvent)),
				),
				exhaustMap(([value, ev]) =>
					!ev.pristine
						? this.router.navigate(["/shop"], {
								queryParamsHandling: "merge",
								queryParams: { q: value },
								state: { skipLoading: true },
							})
						: EMPTY,
				),
			)
			.subscribe();
	}

	ngOnInit() {
		console.log("Initializing");
	}

	openFilters() {
		if (this.show()) return;

		this._open.emit();
		this.show.set(true);
	}

	closeFilters() {
		if (!this.show()) return;

		this._close.emit();
		this.show.set(false);
	}
}
