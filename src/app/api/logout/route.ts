import { type NextRequest, NextResponse } from "next/server";
import { deleteSession } from "@/lib/session";

export async function POST(_req: NextRequest): Promise<NextResponse> {
	deleteSession();
	return NextResponse.json({ status: true, message: "Session deleted :)" });
}
