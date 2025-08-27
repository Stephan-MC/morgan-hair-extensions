import { NgPlural, NgPluralCase } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	input,
	linkedSignal,
} from "@angular/core";
import { ReactionType, Testimonial } from "shared";
import { RatingComponent } from "shared";
import { MatCardModule } from "@angular/material/card";

@Component({
	selector: "web-testimonial",
	imports: [NgPlural, NgPluralCase, RatingComponent, MatCardModule],
	templateUrl: "./testimonial.component.html",
	styleUrl: "./testimonial.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestimonialComponent {
	testimonial = input.required<Testimonial>();
	rating = linkedSignal(
		() =>
			this.testimonial()?.reactions?.find(
				(reaction) => reaction.type.name == ReactionType.RATING,
			) || { rate: 0, type: { mass: 1 } },
	);
	fullname = linkedSignal(
		() =>
			this.testimonial()?.client.first_name +
			" " +
			this.testimonial()?.client.last_name,
	);
	hash = computed(() =>
		this.fullname()
			.split("")
			.reduce(
				(acc: number, char: string) => (acc << 5) - acc + char.charCodeAt(0),
				0,
			),
	);
	bg = computed(() => (this.hash() & 0xffffff).toString(16).padStart(6, "0"));
	color = computed(() =>
		((0xffffff - (this.hash() & 0xffffff)) & 0xffffff)
			.toString(16)
			.padStart(6, "0"),
	);
}
