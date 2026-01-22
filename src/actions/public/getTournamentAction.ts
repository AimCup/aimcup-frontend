"use server";

import { cookies } from "next/headers";
import { client, getTournamentByAbbreviation, type TournamentResponseDto } from "../../../client";

export async function getTournamentAction(
	abbreviation: string,
): Promise<{ status: boolean; data?: TournamentResponseDto; errorMessage?: string }> {
	"use server";
	const cookie = cookies().get("JWT")?.value;
	// configure internal service client
	client.setConfig({
		// set default base url for requests
		baseUrl: process.env.NEXT_PUBLIC_API_URL,
		// set default headers for requests
		headers: {
			Cookie: `token=${cookie}`,
		},
	});

	const { data, error } = await getTournamentByAbbreviation({
		path: {
			abbreviation,
		},
	});

	if (error) {
		return {
			status: false,
			errorMessage: error.errors?.map((e) => e).join(", "),
		};
	}

	return {
		status: true,
		data,
	};
}

