import { Component, computed, inject, linkedSignal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { HairTypeService, ImageComponent } from "shared";

@Component({
	selector: "web-hair-type-list",
	imports: [ImageComponent, RouterLink],
	templateUrl: "./hair-type-list.component.html",
	styleUrl: "./hair-type-list.component.css",
})
export class HairTypeListComponent {
	hairTypes = inject(HairTypeService).hairTypesResource;
	duplicates = computed(() => 15 / this.hairTypes.value().length);
}
