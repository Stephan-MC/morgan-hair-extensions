import { Injectable, PLATFORM_ID, Inject, signal, inject } from "@angular/core";
import { isPlatformServer } from "@angular/common";
import { TransferState, makeStateKey } from "@angular/core";
import { DOCUMENT } from "@angular/common";

// State key for transferring cookies from server to client
const COOKIE_STATE_KEY = makeStateKey<string[]>("ssr_cookies");

export interface CookieOptions {
	expires?: Date | string | number;
	path?: string;
	domain?: string;
	secure?: boolean;
	sameSite?: "Lax" | "Strict" | "None";
	"max-age"?: number;
}

@Injectable({
	providedIn: "root",
})
export class Cookie {
	private readonly isServer: boolean;
	private readonly cookies = signal<Map<string, string>>(new Map());
	private readonly _platformId = inject(PLATFORM_ID);
	private readonly _document = inject(DOCUMENT);
	private readonly _transferState = inject(TransferState);

	constructor() {
		this.isServer = isPlatformServer(this._platformId);

		// --- Client-Side Hydration ---
		// When the app runs in the browser, this logic takes over.
		if (!this.isServer) {
			// 1. Get cookie strings transferred from the server.
			const serverCookieStrings = this._transferState.get(COOKIE_STATE_KEY, []);

			// 2. Set these cookies in the browser document.
			// This is the crucial step to sync the browser's state with the server's.
			// Note: HttpOnly cookies cannot be set via JavaScript. They must be set
			// directly by the browser from the server's response headers. This
			// implementation ensures non-HttpOnly cookies are available.
			serverCookieStrings.forEach((cookieStr) => {
				// We only set cookies that are not HttpOnly
				if (cookieStr.toLowerCase().indexOf("httponly") === -1) {
					this._document.cookie = cookieStr;
				}
			});

			// 3. Clean up the transfer state.
			this._transferState.remove(COOKIE_STATE_KEY);

			// 4. Parse the browser's cookies to populate the service's state.
			this.updateCookiesFromBrowser();
		}
	}

	/**
	 * Gets a cookie value by name.
	 * @param name The name of the cookie.
	 * @returns The cookie value or undefined if not found.
	 */
	get(name: string): string | undefined {
		return this.cookies().get(name);
	}

	/**
	 * Sets a cookie. On the client, this directly sets the browser cookie.
	 * On the server, this method is a no-op; cookies should be set via
	 * response headers using the ServerCookieInterceptor.
	 * @param name The name of the cookie.
	 * @param value The value of the cookie.
	 * @param options Cookie options.
	 */
	set(name: string, value: string, options: CookieOptions = {}): void {
		if (this.isServer) {
			// On the server, setting cookies should be handled by modifying response headers.
			// The ServerCookieInterceptor is responsible for this.
			console.warn(
				"CookieService.set() was called on the server. This is a no-op. Use response headers instead.",
			);
			return;
		}

		let cookieStr = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
		cookieStr += this.buildOptionsString(options);
		this._document.cookie = cookieStr;

		// Update internal state
		this.updateCookiesFromBrowser();
	}

	/**
	 * Deletes a cookie by name.
	 * @param name The name of the cookie.
	 * @param path The path of the cookie to delete.
	 * @param domain The domain of the cookie to delete.
	 */
	delete(name: string, path?: string, domain?: string): void {
		const options: CookieOptions = {
			expires: new Date(0), // Set expiry to a past date
			path,
			domain,
		};
		this.set(name, "", options);
	}

	/**
	 * Checks if a cookie with the given name exists.
	 * @param name The name of the cookie.
	 * @returns True if the cookie exists, false otherwise.
	 */
	has(name: string): boolean {
		return this.cookies().has(name);
	}

	/**
	 * [SERVER-SIDE ONLY]
	 * Reads cookies from an incoming server request and populates the service.
	 * @param cookieHeader The string from the 'cookie' header of the request.
	 */
	populateFromSsrRequest(cookieHeader: string | undefined): void {
		if (!this.isServer || !cookieHeader) {
			return;
		}
		this.parseCookieString(cookieHeader);
	}

	/**
	 * [SERVER-SIDE ONLY]
	 * Stores an array of 'Set-Cookie' header strings in TransferState.
	 * @param setCookieHeaders Array of strings from 'Set-Cookie' headers.
	 */
	transferCookiesToBrowser(setCookieHeaders: string[]): void {
		if (this.isServer) {
			this._transferState.set(COOKIE_STATE_KEY, setCookieHeaders);
		}
	}

	/** Parses the browser's document.cookie and updates the internal state. */
	private updateCookiesFromBrowser(): void {
		if (!this.isServer) {
			this.parseCookieString(this._document.cookie);
		}
	}

	/** Generic parser for a cookie string (from request header or document.cookie) */
	private parseCookieString(cookieStr: string): void {
		const newCookies = new Map<string, string>();
		if (cookieStr) {
			const pairs = cookieStr.split(";");
			for (const pair of pairs) {
				const eqPos = pair.indexOf("=");
				if (eqPos > -1) {
					const key = decodeURIComponent(pair.substring(0, eqPos).trim());
					const value = decodeURIComponent(pair.substring(eqPos + 1).trim());
					newCookies.set(key, value);
				}
			}
		}
		this.cookies.set(newCookies);
	}

	/** Builds the options part of the cookie string. */
	private buildOptionsString(options: CookieOptions): string {
		let optsStr = "";
		if (options.expires) {
			if (options.expires instanceof Date) {
				optsStr += `; expires=${options.expires.toUTCString()}`;
			} else {
				optsStr += `; expires=${options.expires}`;
			}
		}
		if (options["max-age"]) {
			optsStr += `; max-age=${options["max-age"]}`;
		}
		optsStr += `; path=${options.path || "/"}`;
		if (options.domain) {
			optsStr += `; domain=${options.domain}`;
		}
		if (options.secure) {
			optsStr += "; Secure";
		}
		if (options.sameSite) {
			optsStr += `; SameSite=${options.sameSite}`;
		}
		return optsStr;
	}
}
