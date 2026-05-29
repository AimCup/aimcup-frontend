import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
	client,
	getTournamentStaffMember,
	me,
	type StaffMemberResponseDto,
} from "../../../client";
import { verifySession } from "@/lib/session";

export function configureApiClient(): string | undefined {
	const token = cookies().get("JWT")?.value;
	client.setConfig({
		baseUrl: process.env.NEXT_PUBLIC_API_URL,
		headers: token ? { Cookie: `token=${token}` } : {},
	});
	return token;
}

export async function requireAuth(): Promise<string> {
	const { isAuth, token } = await verifySession();
	if (!isAuth || !token) {
		redirect("/401");
	}
	configureApiClient();
	return token;
}

function redirectForApiFailure(status?: number): never {
	if (status === 401) {
		redirect("/401");
	}
	redirect("/403");
}

export async function requireStaffMember(abbreviation: string): Promise<StaffMemberResponseDto> {
	await requireAuth();

	const { data, error, response } = await getTournamentStaffMember({
		path: { abbreviation },
	});

	if (error || !data) {
		redirectForApiFailure(response.status);
	}

	return data;
}

export async function requireGlobalAdmin(): Promise<void> {
	await requireAuth();

	const { data, error, response } = await me();
	if (error || !data) {
		redirectForApiFailure(response.status);
	}

	const isAdmin = data.roles?.some((role) => role.name === "ROLE_ADMIN");
	if (!isAdmin) {
		redirect("/403");
	}
}
