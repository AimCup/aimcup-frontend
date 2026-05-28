"use server";

import { cookies } from "next/headers";
import { client, registerParticipant } from "../../../client";
import { multipleRevalidatePaths } from "@/lib/multipleRevalidatePaths";

export async function registerForAuctionAction(
    tournamentAbb: string,
    wantsToBeCaptain: boolean,
    auctionMessage?: string,
) {
    "use server";

    const cookie = cookies().get("JWT")?.value;
    client.setConfig({
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
        headers: { Cookie: `token=${cookie}` },
    });

    const { data, error } = await registerParticipant({
        path: { abbreviation: tournamentAbb },
        body: { wantsToBeCaptain, auctionMessage: auctionMessage || undefined },
    });

    if (error) {
        return {
            status: false as const,
            errorMessage: (error as { errors?: string[] }).errors?.join(", ") ?? "Registration failed",
        };
    }

    await multipleRevalidatePaths([
        "/",
        `/tournament/${tournamentAbb}`,
        `/tournament/${tournamentAbb}/registration`,
    ]);

    return { status: true as const, response: data };
}
