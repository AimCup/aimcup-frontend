"use server";

import { cookies } from "next/headers";
import { client, createTeam, inviteParticipant } from "../../../client";
import { type CreateTeamSchemaType } from "@/formSchemas/createTeamSchema";
import { type inviteToTeamSchemaType } from "@/formSchemas/inviteToTeamSchema";
import { multipleRevalidatePaths } from "@/lib/multipleRevalidatePaths";

export async function createTeamAction(formData: CreateTeamSchemaType) {
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

	if (formData.terms === "off") {
		return {
			status: false as const,
			errorMessage: "You need to accept the terms and conditions",
		};
	}

	const { data, error } = await createTeam({
		path: {
			abbreviation: formData.tournamentAbb,
		},
		body: {
			name: formData.teamName,
			logoUrl: "",
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
		`/tournament/${formData.tournamentAbb}`,
		`/tournament/${formData.tournamentAbb}/teams`,
	]);

	return {
		status: true as const,
		response: data,
	};
}

export async function updateTeamAction(formDataToSend: FormData) {
	"use server";
	const cookie = cookies().get("JWT")?.value;
	const apiUrl = process.env.NEXT_PUBLIC_API_URL;
	
	if (!apiUrl) {
		return {
			status: false as const,
			errorMessage: "API URL is not configured",
		};
	}

	const tournamentAbbreviation = formDataToSend.get("tournamentAbbreviation") as string;
	const teamId = formDataToSend.get("teamId") as string;
	const name = formDataToSend.get("name") as string;

	if (!tournamentAbbreviation || !teamId || !name) {
		return {
			status: false as const,
			errorMessage: "Missing required fields",
		};
	}

	// Create new FormData with only the fields needed for the API
	const apiFormData = new FormData();
	apiFormData.append("name", name);
	const logo = formDataToSend.get("logo");
	if (logo instanceof File && logo.size > 0) {
		apiFormData.append("logo", logo);
	}

	// Use fetch directly for multipart/form-data
	const response = await fetch(
		`${apiUrl}/tournaments/${tournamentAbbreviation}/teams/${teamId}`,
		{
			method: "PUT",
			headers: {
				Cookie: `token=${cookie}`,
			},
			body: apiFormData,
		}
	);

	if (!response.ok) {
		const errorText = await response.text();
		let errorData;
		try {
			errorData = JSON.parse(errorText);
		} catch {
			errorData = { errors: [errorText || "Failed to update team"] };
		}
		return {
			status: false as const,
			errorMessage: errorData.errors?.map((e: string) => e).join(", ") || errorData.message || "Failed to update team",
		};
	}

	await multipleRevalidatePaths([
		"/",
		`/tournament/${tournamentAbbreviation}/teams/${teamId}`,
		`/tournament/${tournamentAbbreviation}`,
	]);

	return {
		status: true as const,
	};
}

export async function inviteToTeamAction(formData: inviteToTeamSchemaType) {
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
	const { data, error } = await inviteParticipant({
		path: {
			abbreviation: formData.tournamentAbbreviation,
			teamId: formData.teamId,
			osuId: formData.osuId,
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
		`/tournament/${formData.tournamentAbbreviation}/teams/${formData.teamId}`,
		`/tournament/${formData.tournamentAbbreviation}`,
	]);

	return {
		status: true as const,
		response: data,
	};
}
