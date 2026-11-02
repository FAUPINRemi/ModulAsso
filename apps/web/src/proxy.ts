import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, VUE_COOKIE } from "@/lib/cookies";
import { isMobilePath, pickVue, toDesktopPath, toMobilePath } from "@/lib/device";

// Next 16 appelle "proxy" ce que l'architecture nomme "middleware" : même rôle.
// Il fait deux choses : demander une session, puis choisir la vue bureau ou mobile.
// Le vrai contrôle des droits reste dans l'API (jeton, rôle, module actif).

const PUBLIC_PREFIXES = ["/connexion", "/inscription", "/invitation"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  const hasSession = request.cookies.has(SESSION_COOKIE);

  const redirectTo = (path: string) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    url.search = "";
    return NextResponse.redirect(url);
  };

  if (isPublic) return hasSession && pathname === "/connexion" ? redirectTo("/") : NextResponse.next();
  if (!hasSession) return redirectTo("/connexion");

  const vue = pickVue({
    cookie: request.cookies.get(VUE_COOKIE)?.value,
    chMobile: request.headers.get("sec-ch-ua-mobile"),
    userAgent: request.headers.get("user-agent"),
  });
  if (vue === "mobile" && !isMobilePath(pathname)) return redirectTo(toMobilePath(pathname));
  if (vue === "bureau" && isMobilePath(pathname)) return redirectTo(toDesktopPath(pathname));
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/|api/|manifest.webmanifest|.*\\..*).*)"],
};
