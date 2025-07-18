import { Routes } from "@angular/router";

export const routes: Routes = [
	{
		path: "",
		pathMatch: "full",
		loadComponent: () => import("./home/home.page").then((m) => m.HomePage),
	},
	{
		path: "shop",
		title: "Browser our shop with millions of wigs for different taste",
		loadComponent: () => import("./shop/shop.page").then((m) => m.ShopPage),
	},
	{
		path: "contact",
		title: "Any Problem ? We got you covered.",
		loadComponent: () =>
			import("./contact/contact.page").then((m) => m.ContactPage),
	},
	{
		path: "about",
		title: "Morgan Hair Extensions",
		loadComponent: () => import("./about/about.page").then((m) => m.AboutPage),
	},
	{
		path: "checkout",
		loadComponent: () =>
			import("./checkout/checkout.page").then((m) => m.CheckoutPage),
	},
	{
		path: "cart",
		loadComponent: () => import("./cart/cart.page").then((m) => m.CartPage),
	},
	{
		path: "wig/:slug",
		loadComponent: () => import("./wig/wig.page").then((m) => m.WigPage),
	},
	{
		path: "login",
		loadComponent: () => import("./login/login.page").then((m) => m.LoginPage),
	},
	{
		path: "signup",
		loadComponent: () =>
			import("./signup/signup.page").then((m) => m.SignupPage),
	},
	{
		path: "test",
		loadComponent: () => import("./test/test.page").then((m) => m.TestPage),
	},
];
