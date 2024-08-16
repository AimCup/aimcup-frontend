"use server";

import { type AddStaffMembersSchemaType } from "@/formSchemas/addEditStaffMembersSchema";
import { type AddUserLessStaffMembersSchemaType } from "@/formSchemas/addEditUserLessStaffMembersSchema";
import { addStaffMembers, updateStaffMembers } from "../../../client";
import { multipleRevalidatePaths } from "@/lib/helpers";

export async function editStaffMemberAction(formData: AddStaffMembersSchemaType) {
	"use server";

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

	multipleRevalidatePaths(["/", `/dashboard/${formData.tournamentAbbreviation}/staff-members`]);

	return {
		status: true as const,
		response: data,
	};
}

export async function addStaffMemberAction(formData: AddStaffMembersSchemaType) {
	"use server";

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

	multipleRevalidatePaths(["/", `/dashboard/${formData.tournamentAbbreviation}/staff-members`]);

	return {
		status: true as const,
		response: data,
	};
}

export async function addUserLessStaffMemberAction(formData: AddUserLessStaffMembersSchemaType) {
	"use server";

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

	multipleRevalidatePaths(["/", `/dashboard/${formData.tournamentAbbreviation}/staff-members`]);

	return {
		status: true as const,
		response: data,
	};
}
