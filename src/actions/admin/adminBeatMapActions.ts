"use server";
import { cookies } from "next/headers";
import { addBeatmap, client, type modification } from "../../../client";
import { type AddBeatMapSchemaType } from "@/formSchemas/addBeatMapSchema";
// import { multipleRevalidatePaths } from "@/lib/multipleRevalidatePaths";

export async function addBeatMapAction(formData: AddBeatMapSchemaType) {
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
	const { data, error } = await addBeatmap({
		path: {
			abbreviation: formData.tournamentAbb,
			modification: formData.modification as modification,
			mappoolId: formData.mappoolId,
		},
		body: {
			url: formData.url,
			position: +formData.position,
			isCustom: formData?.isCustom === "on",
		},
	});

	if (error) {
		return {
			status: false as const,
			errorMessage: error.errors?.map((e) => e).join(", "),
		};
	}

	// await multipleRevalidatePaths([
	// 	"/",
	// 	`/dashboard/${formData.tournamentAbb}/mappool/${formData.mappoolId}`,
	// 	`/tournament/${formData.tournamentAbb}/mappool/${formData.mappoolId}`,
	// ]);
	//todo: revalidate paths

	return {
		status: true as const,
		response: data,
	};
}
