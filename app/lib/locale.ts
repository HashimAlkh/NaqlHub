import "server-only";

import { cookies } from "next/headers";
import { LOCALE_COOKIE, type Locale, isLocale } from "@/app/i18n";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const locale = cookieStore.get(LOCALE_COOKIE)?.value;
  return isLocale(locale) ? locale : "en";
}
