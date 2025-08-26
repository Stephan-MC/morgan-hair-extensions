import type { Discount } from "../discount";
import type { Media } from "../media";
import { Model } from "../model";
import { Review } from "../review";

export namespace Wig {
	export interface Color extends Model {
		name: string;
		code: string;
	}

	export interface Length extends Model {
		value: number;
		price: number;
		stock: number;
		default: boolean;
	}
	export interface Source extends Model {
		name: string;
	}
	export interface Texture extends Model {
		name: string;
	}
	export interface Lace extends Model {
		name: string;
	}
	export interface HairType extends Model {
		name: string;
		thumbnail: Media;
	}
	export interface Parting extends Model {
		name: string;
	}
	export interface Cap extends Model {
		size: number;
	}
}

export interface Wig extends Model {
	name: string;
	slug: string;
	description: string;
	featured: string;
	stock: number;

	discount: Discount;
	liked: boolean;
	length: Wig.Length & { price: number; default: boolean };
	thumbnail: Media;
	gallery: Array<Media>;

	lengths: Array<Wig.Length & { price: number; default: boolean }>;
	reviews: Array<Review>;
	rating: {
		/** The total number of clients who rated the product */
		count: number;

		/** The total number of stars awarded by all clients who rated */
		weight: number;
	} & Omit<Model, "id">;
	love: {
		/** The total number of clients who rated the product */
		count: number;

		/** The total number of stars awarded by all clients who rated */
		weight: number;
	} & Omit<Model, "id">;
	discounts: Array<Discount>;
	hair_type: Wig.HairType;
	color: Wig.Color;
	lace: Wig.Lace;
	source: Wig.Source;
	texture: Wig.Texture;
	parting: Wig.Parting;
	cap: Wig.Cap;
}

export interface WigFilter {
	/** The query string. used to filter wigs by name */
	q?: string;

	/** The Color code, name or id used to filter wigs */
	color?: Wig.Color["name"] | Wig.Color["id"] | Wig.Color["code"];

	hair_type?: Wig.HairType["name"] | Wig.HairType["id"];

	lace?: Wig.Lace["name"] | Wig.Lace["id"];

	length?: Wig.Length["id"] | Wig.Length["value"];

	source?: Wig.Source["name"] | Wig.Source["id"];

	texture?: Wig.Texture["name"] | Wig.Texture["id"];

	parting?: Wig.Parting["name"];

	cap?: Wig.Cap["size"];

	page?: number;

	/** Indicates whether only the featured products should be selected or not */
	featured?: boolean;
}
