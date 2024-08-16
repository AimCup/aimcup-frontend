"use server";

import { updateTournamentImage } from "../../../client";
import { multipleRevalidatePaths } from "@/lib/helpers";

export async function editTournamentImageAction(formData: FormData) {
	"use server";

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

	multipleRevalidatePaths([
		"/",
		`/dashboard/${abbreviation as string}`,
		`/tournament/${abbreviation as string}`,
	]);

	return {
		status: true as const,
		response: data,
	};
}
