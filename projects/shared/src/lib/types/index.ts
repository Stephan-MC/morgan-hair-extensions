export interface Paginated<T = any> {
	data: Array<T>;
	links: {
		first: string;
		last: string;
		prev: string | null;
		next: string | null;
	};
	meta: {
		/** The current page for which the data is loaded */
		current_page: number;

		/**
		 * The index of the first item on the current page
		 * with respect to the total number of items to be paginated
		 */
		from: number | null;

		/** The index of the last item on the current page */
		to: number | null;

		/** The base path of the request */
		path: string;

		/** The number of items sent per page */
		perPage: number;

		last_page: number;

		/** Total number of items to be paginated */
		total: number | null;

		links: Array<{
			url: string | null;
			label: string | number;
			active: boolean;
		}>;
	};
}

export interface PaginatedWithExtra<T = any, E = any> extends Paginated<T> {
	extra?: E;
}

export * from "./environment";
export * from "./comment";
export * from "./category";
export * from "./discount";
export * from "./media";
export * from "./model";
export * from "./order";
export * from "./user";
export * from "./reactions";
export * from "./review";
export * from "./testimonial";
export * from "./wig";
export * from "./auth";
