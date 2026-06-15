"use server";

import { cookies } from "next/headers";
import { addStaffMembers, client, deleteStaffMembers, updateStaffMembers } from "../../../client";
import { type AddStaffMembersSchemaType } from "@/formSchemas/addEditStaffMembersSchema";
import { type AddUserLessStaffMembersSchemaType } from "@/formSchemas/addEditUserLessStaffMembersSchema";
import { multipleRevalidatePaths } from "@/lib/multipleRevalidatePaths";

export async function editStaffMemberAction(formData: AddStaffMembersSchemaType) {
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
	const { data, error } = await updateStaffMembers({
		path: {
			staffMemberId: formData.osuId,
			abbreviation: formData.tournamentAbbreviation,
		},
		body: {
			discordId: formData.discordId,
			roles: formData.roles,
			permissions: formData.permissions,
		},
	});

	if (error) {
		return {
			status: false as const,
			// errorMessage: error.errors?.map((e) => e).join(", "), //todo
		};
	}

	await multipleRevalidatePaths([
		"/",
		`/dashboard/${formData.tournamentAbbreviation}/staff-members`,
	]);

	return {
		status: true as const,
		response: data,
	};
}

export async function addStaffMemberAction(formData: AddStaffMembersSchemaType) {
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
	const { data, error } = await addStaffMembers({
		path: {
			abbreviation: formData.tournamentAbbreviation,
		},
		body: {
			osuId: formData.osuId,
			discordId: formData.discordId,
			roles: formData.roles,
			permissions: formData.permissions,
		},
	});

	if (error) {
		return {
			status: false as const,
			// errorMessage: error.errors?.map((e) => e).join(", "), //todo
		};
	}

	await multipleRevalidatePaths([
		"/",
		`/dashboard/${formData.tournamentAbbreviation}/staff-members`,
	]);

	return {
		status: true as const,
		response: data,
	};
}

export async function deleteStaffMemberAction(abbreviation: string, staffMemberId: string) {
	"use server";
	const cookie = cookies().get("JWT")?.value;
	client.setConfig({
		baseUrl: process.env.NEXT_PUBLIC_API_URL,
		headers: {
			Cookie: `token=${cookie}`,
		},
	});
	const { error } = await deleteStaffMembers({
		path: {
			abbreviation,
			staffMemberId,
		},
	});

	if (error) {
		return {
			status: false as const,
			errorMessage: "Failed to delete staff member.",
		};
	}

	await multipleRevalidatePaths([
		"/",
		`/dashboard/${abbreviation}/staff-members`,
	]);

	return {
		status: true as const,
	};
}

export async function addUserLessStaffMemberAction(formData: AddUserLessStaffMembersSchemaType) {
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
	const { data, error } = await addStaffMembers({
		path: {
			abbreviation: formData.tournamentAbbreviation,
		},
		body: {
			username: formData.username,
			roles: formData.roles,
			redirectUrl: formData.redirectUrl,
			imageUrl: formData.imageUrl,
		},
	});

	if (error) {
		return {
			status: false as const,
			// errorMessage: error.errors?.map((e) => e).join(", "), //todo
		};
	}

	await multipleRevalidatePaths([
		"/",
		`/dashboard/${formData.tournamentAbbreviation}/staff-members`,
	]);

	return {
		status: true as const,
		response: data,
	};
}
