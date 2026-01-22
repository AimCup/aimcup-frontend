"use server";

import { cookies } from "next/headers";
import { client, getStaffMembers1 } from "../../../client";
import type { selectOptions } from "@ui/atoms/Forms/Select/ComboBox";

export async function getStaffMembersAction(
	tournamentAbbreviation: string,
): Promise<selectOptions[]> {
	const cookie = cookies().get("JWT")?.value;
	client.setConfig({
		baseUrl: process.env.NEXT_PUBLIC_API_URL,
		headers: {
			Cookie: `token=${cookie}`,
		},
	});

	const { data } = await getStaffMembers1({
		path: {
			abbreviation: tournamentAbbreviation,
		},
	});

	const staffMemberOptions: selectOptions[] =
		data
			?.filter((s) => s.user)
			?.map((staffMember) => ({
				id: staffMember.id,
				label: staffMember.user
					? staffMember.user.username
					: staffMember.username || "",
			})) || [];

	return staffMemberOptions;
}




