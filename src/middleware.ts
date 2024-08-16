import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { client } from "../client";
import { decrypt } from "@/lib/session";

// 1. Specify protected and public routes
const protectedRoutes = ["/dashboard", "/account"];
const publicRoutes = ["/tournament", "/"];

export default async function middleware(req: NextRequest) {
	// 2. Check if the current route is protected or public
	const path = req.nextUrl.pathname;
	const isProtectedRoute = protectedRoutes.includes(path);
	const isPublicRoute = publicRoutes.includes(path);

	// 3. Decrypt the session from the cookie
	const cookie = cookies().get("JWT")?.value;
	const session = await decrypt(cookie);

	// configure internal service client
	client.setConfig({
		// set default base url for requests
		baseUrl: process.env.NEXT_PUBLIC_API_URL,
		// set default headers for requests
		headers: {
			Authorization: `Bearer ${session?.token as string}`,
		},
	});

	// 4. Redirect
	if (isProtectedRoute && !session?.token) {
		return NextResponse.redirect(new URL("/register", req.nextUrl));
	}

	if (isPublicRoute && session?.token && !req.nextUrl.pathname.startsWith("/")) {
		return NextResponse.redirect(new URL("/", req.nextUrl));
	}

	return NextResponse.next();
}
