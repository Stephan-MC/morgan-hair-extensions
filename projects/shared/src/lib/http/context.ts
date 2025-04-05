import { HttpContextToken } from "@angular/common/http";

export const HTTP_REQUIRE_ACCESS_TOKEN = new HttpContextToken<boolean>(() => false)
export const HTTP_SKIP_ON_SERVER = new HttpContextToken<boolean>(() => false)
