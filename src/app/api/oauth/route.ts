import { type NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/session";

export async function GET(req: NextRequest): Promise<NextResponse> {
	// Extract the token from the URL query parameters
	const { searchParams } = new URL(req.url);
	const token = searchParams.get("token");
	const redirect = searchParams.get("redirect");

	// Pass the token to the createSession function
	if (token && redirect) {
		await createSession(token, redirect);
		// Return an appropriate response
		return NextResponse.json({ message: "Session created :)" });
	}

	return NextResponse.json({ message: "Session not created :(" });
}
