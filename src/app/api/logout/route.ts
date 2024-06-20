import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
	const response = NextResponse.redirect(new URL("/", req.url));
	response.cookies.delete("token");
	response.cookies.delete("oauth2_auth_request");
	return response;
}
