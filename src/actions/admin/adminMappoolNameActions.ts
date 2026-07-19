"use server";

import { cookies } from "next/headers";
import { client, updateMappool, type stageType } from "../../../client";
import { multipleRevalidatePaths } from "@/lib/multipleRevalidatePaths";
import { type MappoolNameSchemaType } from "@/formSchemas/mappoolNameSchema";

export async function updateMappoolNameAction(formData: MappoolNameSchemaType) {
	"use server";
	const cookie = cookies().get("JWT")?.value;
	client.setConfig({
		baseUrl: process.env.NEXT_PUBLIC_API_URL,
		headers: {
			Cookie: `token=${cookie}`,
		},
	});

	const { data, error } = await updateMappool({
		path: {
			abbreviation: formData.tournamentAbb,
			stageType: formData.stageType as stageType,
		},
		body: {
			displayName: formData.displayName,
		},
	});

	if (error) {
		return {
			status: false as const,
			errorMessage: error.errors?.map((e) => e).join(", ") ?? "Failed to rename mappool",
		};
	}

	// The label shows on the public tournament page, the mappool nav and the pool page itself.
	await multipleRevalidatePaths([
		"/",
		`/dashboard/${formData.tournamentAbb}`,
		`/tournament/${formData.tournamentAbb}`,
		`/tournament/${formData.tournamentAbb}/mappool/${formData.stageType}`,
	]);

	return {
		status: true as const,
		response: data,
	};
}
