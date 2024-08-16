"use server";

import { cookies } from "next/headers";
import { client, createTeam, inviteParticipant, updateTeam } from "../../../client";
import { type CreateTeamSchemaType } from "@/formSchemas/createTeamSchema";
import { type updateTeamSchemaType } from "@/formSchemas/updateTeamSchema";
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

export async function updateTeamAction(formData: updateTeamSchemaType) {
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
	const { data, error } = await updateTeam({
		path: {
			abbreviation: formData.tournamentAbbreviation,
			teamId: formData.teamId,
		},
		body: {
			name: formData.name,
			logoUrl: formData.logoUrl,
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
