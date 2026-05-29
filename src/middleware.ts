import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const protectedRoutes = ["/dashboard", "/account"];
const publicRoutes = ["/tournament", "/"];

function isRouteProtected(path: string): boolean {
	return protectedRoutes.some((route) => path === route || path.startsWith(`${route}/`));
}

export default async function middleware(req: NextRequest) {
	const path = req.nextUrl.pathname;
	const isProtectedRoute = isRouteProtected(path);
	const isPublicRoute = publicRoutes.includes(path);

	const cookie = cookies().get("JWT")?.value;

	if (isProtectedRoute && !cookie) {
		return NextResponse.redirect(new URL("/401", req.nextUrl));
	}

	if (isPublicRoute && cookie && !req.nextUrl.pathname.startsWith("/")) {
		return NextResponse.redirect(new URL("/", req.nextUrl));
	}

	return NextResponse.next();
}
