"use server";

import { cookies } from "next/headers";
import { client, addParticipantToTeam, removeParticipantFromTeam, changeTeamCaptain, deleteTeam, changeTeamStatus } from "../../../client";
import { multipleRevalidatePaths } from "@/lib/multipleRevalidatePaths";

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
		`${apiUrl}/admin/tournaments/${tournamentAbbreviation}/teams/${teamId}`,
		{
			method: "PATCH",
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
		`/dashboard/${tournamentAbbreviation}/teams`,
		`/tournament/${tournamentAbbreviation}/teams/${teamId}`,
		`/account/`,
	]);

	return {
		status: true as const,
	};
}

export async function addParticipantAction(
	tournamentAbbreviation: string,
	teamId: string,
	osuId: string,
) {
	"use server";
	const cookie = cookies().get("JWT")?.value;
	client.setConfig({
		baseUrl: process.env.NEXT_PUBLIC_API_URL,
		headers: {
			Cookie: `token=${cookie}`,
		},
	});

	const { data, error } = await addParticipantToTeam({
		path: {
			abbreviation: tournamentAbbreviation,
			teamId: teamId,
			osuId: osuId,
		},
	});

	if (error) {
		const errorMessage: string = error.errors?.join(", ") || "Failed to add participant";
		return {
			status: false as const,
			errorMessage,
		};
	}

	await multipleRevalidatePaths([
		"/",
		`/dashboard/${tournamentAbbreviation}/teams`,
		`/tournament/${tournamentAbbreviation}/teams/${teamId}`,
	]);

	return {
		status: true as const,
		team: data,
	};
}

export async function removeParticipantAction(
	tournamentAbbreviation: string,
	teamId: string,
	osuId: string,
) {
	"use server";
	const cookie = cookies().get("JWT")?.value;
	client.setConfig({
		baseUrl: process.env.NEXT_PUBLIC_API_URL,
		headers: {
			Cookie: `token=${cookie}`,
		},
	});

	const { data, error } = await removeParticipantFromTeam({
		path: {
			abbreviation: tournamentAbbreviation,
			teamId: teamId,
			osuId: osuId,
		},
	});

	if (error) {
		const errorMessage: string = error.errors?.join(", ") || "Failed to remove participant";
		return {
			status: false as const,
			errorMessage,
		};
	}

	await multipleRevalidatePaths([
		"/",
		`/dashboard/${tournamentAbbreviation}/teams`,
		`/tournament/${tournamentAbbreviation}/teams/${teamId}`,
	]);

	return {
		status: true as const,
		team: data,
	};
}

export async function changeCaptainAction(
	tournamentAbbreviation: string,
	teamId: string,
	osuId: string,
) {
	"use server";
	const cookie = cookies().get("JWT")?.value;
	client.setConfig({
		baseUrl: process.env.NEXT_PUBLIC_API_URL,
		headers: {
			Cookie: `token=${cookie}`,
		},
	});

	const { data, error } = await changeTeamCaptain({
		path: {
			abbreviation: tournamentAbbreviation,
			teamId: teamId,
			osuId: osuId,
		},
	});

	if (error) {
		const errorMessage: string = error.errors?.join(", ") || "Failed to change captain";
		return {
			status: false as const,
			errorMessage,
		};
	}

	await multipleRevalidatePaths([
		"/",
		`/dashboard/${tournamentAbbreviation}/teams`,
		`/tournament/${tournamentAbbreviation}/teams/${teamId}`,
	]);

	return {
		status: true as const,
		team: data,
	};
}

export async function deleteTeamAction(
	tournamentAbbreviation: string,
	teamId: string,
) {
	"use server";
	const cookie = cookies().get("JWT")?.value;
	client.setConfig({
		baseUrl: process.env.NEXT_PUBLIC_API_URL,
		headers: {
			Cookie: `token=${cookie}`,
		},
	});

	const { error } = await deleteTeam({
		path: {
			abbreviation: tournamentAbbreviation,
			teamId: teamId,
		},
	});

	if (error) {
		const errorMessage: string = error.errors?.join(", ") || "Failed to delete team";
		return {
			status: false as const,
			errorMessage,
		};
	}

	await multipleRevalidatePaths([
		"/",
		`/dashboard/${tournamentAbbreviation}/teams`,
		`/account/`,
	]);

	return {
		status: true as const,
	};
}

export async function changeTeamStatusAction(
	tournamentAbbreviation: string,
	teamId: string,
	status: "ACCEPTED" | "REJECTED",
) {
	"use server";
	const cookie = cookies().get("JWT")?.value;
	client.setConfig({
		baseUrl: process.env.NEXT_PUBLIC_API_URL,
		headers: {
			Cookie: `token=${cookie}`,
		},
	});

	const { error } = await changeTeamStatus({
		path: {
			abbreviation: tournamentAbbreviation,
			teamId: teamId,
		},
		query: {
			status: status,
		},
	});

	if (error) {
		const errorMessage: string = error.errors?.join(", ") || "Failed to change team status";
		return {
			status: false as const,
			errorMessage,
		};
	}

	await multipleRevalidatePaths([
		"/",
		`/dashboard/${tournamentAbbreviation}/teams`,
		`/tournament/${tournamentAbbreviation}/teams/${teamId}`,
		`/account/`,
	]);

	return {
		status: true as const,
	};
}
