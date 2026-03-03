import { createNavigation } from "next-intl/navigation";
import { defaultLocale, locales } from "./routing";

export const { Link, usePathname, useRouter, redirect } = createNavigation({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
});
