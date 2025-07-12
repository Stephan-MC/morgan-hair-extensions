import { NgOptimizedImage } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	input,
	linkedSignal,
} from "@angular/core";
import type { Media } from "../../types/media";

@Component({
	selector: "thumbnail",
	imports: [NgOptimizedImage],
	templateUrl: "./image.component.html",
	styleUrl: "./image.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageComponent {
	src = input.required<string, Media | File | string | undefined | null>({
		transform: (src) =>
			typeof src === "string" && src !== ""
				? src
				: (src as Media)?.url
					? (src as Media).url
					: src instanceof File
						? URL.createObjectURL(src)
						: "/assets/images/logo.jpg",
	});
	alt = input<string>();
	/** Whether or not this thumbnail should be loaded first */
	priority = input<boolean>(false);

	type = linkedSignal(() =>
		this.src().startsWith("blob:") ? "preview" : "default",
	);
}
