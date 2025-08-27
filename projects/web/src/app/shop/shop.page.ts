import { ViewportScroller } from "@angular/common";
import {
	Component,
	effect,
	inject,
	input,
	linkedSignal,
	signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { filter, tap } from "rxjs/operators";
import { WigFilter } from "shared";
import { PaginationComponent } from "../common/components/pagination/pagination.component";
import { ProductCardSkeletonComponent } from "../common/components/product-card-skeleton/product-card-skeleton.component";
import { ShopFilterComponent } from "../common/components/shop-filter/shop-filter.component";
import { WigCardComponent } from "../common/components/wig-card/wig-card.component";
import { WigService } from "../common/services/wig.service";
import { CartStore } from "../common/stores/cart.store";
import { MatPaginatorModule } from "@angular/material/paginator";

@Component({
	selector: "web-shop",
	imports: [
		FormsModule,
		ProductCardSkeletonComponent,
		ShopFilterComponent,
		WigCardComponent,
		MatPaginatorModule,
	],
	templateUrl: "./shop.page.html",
	styleUrl: "./shop.page.css",
	host: {
		"[class.mt-12]": "true",
		"[class.min-h-screen]": "true",
	},
})
export class ShopPage {
	readonly viewPortScroller = inject(ViewportScroller);
	private _route = inject(ActivatedRoute);
	private _wigService = inject(WigService);
	readonly router = inject(Router);
	wigs = this._wigService.wigsResource;
	cart = inject(CartStore);
	filterOpen = signal(false);

	_page = input<number>(undefined, { alias: "page" });
	page = linkedSignal(() => this._page());

	constructor() {
		this._route.queryParams
			.pipe(
				takeUntilDestroyed(),
				tap((params) => {
					this._wigService.setFilter(params as WigFilter);
				}),
			)
			.subscribe();

		this.router.events
			.pipe(
				takeUntilDestroyed(),
				filter((ev) => ev instanceof NavigationEnd),
				tap(() => this.viewPortScroller.scrollToPosition([0, 0])),
			)
			.subscribe();

		effect(() => {
			if (this.page()) {
				this.viewPortScroller.scrollToPosition([0, 0]);
				this._wigService.patchFilter({ page: this.page() });
			}
		});
	}

	hasFilters() {
		return Object.keys(this._wigService.getFilter()).length;
	}

	doSomthing(data: any) {
		console.log(data);
	}
}
