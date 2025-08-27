import {
	animate,
	query,
	stagger,
	style,
	transition,
	trigger,
} from "@angular/animations";
import { ViewportScroller } from "@angular/common";
import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ProductCardSkeletonComponent } from "../common/components/product-card-skeleton/product-card-skeleton.component";
import { TestimonialListComponent } from "../common/components/testimonial-list/testimonial-list.component";
import { WigCardComponent } from "../common/components/wig-card/wig-card.component";
import { WigService } from "../common/services/wig.service";
import { HeroComponent } from "./common/components/hero/hero.component";
import { HairTypeListComponent } from "../common/components/hair-type-list/hair-type-list.component";
import { MatButtonModule } from "@angular/material/button";

@Component({
	selector: "web-home",
	imports: [
		RouterLink,
		MatButtonModule,
		WigCardComponent,
		ProductCardSkeletonComponent,
		HeroComponent,
		TestimonialListComponent,
		HairTypeListComponent,
	],
	templateUrl: "./home.page.html",
	styleUrl: "./home.page.css",
	animations: [
		trigger("ng-animation-list", [
			transition(":enter", [
				query(
					"ng-animation-list-item",
					[
						style({ opacity: 0, transform: "translateY(-100px)" }),
						stagger(400, [
							animate(
								"500ms cubic-bezier(0.35, 0, 0.25, 1)",
								style({ opacity: 1, transform: "none" }),
							),
						]),
					],
					{ optional: true },
				),
				// query(':enter',
				// )
			]),
		]),
	],
})
export class HomePage {
	viewPortScroller = inject(ViewportScroller);
	products = inject(WigService).featuredWigsResource;
}
