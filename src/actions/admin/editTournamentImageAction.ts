"use server";

import { AdminTournamentService } from "../../../generated";
import { executeFetch } from "@/lib/executeFetch";

export async function editTournamentImageAction(formData: FormData) {
	"use server";

	const image = formData.get("image");
	if (!image) {
		throw new Error("Image is required");
	}
	const abbreviation = formData.get("abbreviation");
	if (!abbreviation) {
		throw new Error("Abbreviation is required");
	}

	return executeFetch(
		AdminTournamentService.updateTournamentImage(abbreviation as string, "BANNER", {
			image: image as Blob,
		}),
		["/", `/dashboard/${abbreviation as string}`, `/tournament/${abbreviation as string}`],
	)
		.then((_res) => {
			return {
				status: true as const,
			};
		})
		.catch((_error) => {
			return {
				status: false as const,
			};
		});
}
