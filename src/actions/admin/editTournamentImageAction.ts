"use server";

import { cookies } from "next/headers";
import { client, updateTournamentImage } from "../../../client";
import { multipleRevalidatePaths } from "@/lib/multipleRevalidatePaths";

export async function editTournamentImageAction(formData: FormData) {
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
	const image = formData.get("image");
	if (!image) {
		return {
			status: false as const,
			errorMessage: "Image is required",
		};
	}
	const abbreviation = formData.get("abbreviation");
	if (!abbreviation) {
		return {
			status: false as const,
			errorMessage: "Abbreviation is required",
		};
	}

	const { data, error } = await updateTournamentImage({
		path: {
			abbreviation: abbreviation as string,
		},
		query: {
			imageType: "BANNER",
		},
		body: {
			image: image as Blob,
		},
	});

	if (error) {
		return {
			status: false as const,
			errorMessage: error.errors?.map((e) => e).join(", "),
		};
	}

	await multipleRevalidatePaths([
		"/",
		`/dashboard/${abbreviation as string}`,
		`/tournament/${abbreviation as string}`,
	]);

	return {
		status: true as const,
		response: data,
	};
}
