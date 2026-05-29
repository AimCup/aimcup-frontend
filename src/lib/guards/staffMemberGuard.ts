import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
	client,
	getTournamentStaffMember,
	getUserTournamentStaffMember,
	me,
	type StaffMemberResponseDto,
} from "../../../client";
import { verifySession } from "@/lib/session";

type DashboardAccess = {
	isAuthenticated: boolean;
	canAccess: boolean;
	isAdmin: boolean;
};

const resolveDashboardAccess = cache(async (): Promise<DashboardAccess> => {
	const { isAuth, token } = await verifySession();
	if (!isAuth || !token) {
		return { isAuthenticated: false, canAccess: false, isAdmin: false };
	}
	configureApiClient();
	const [{ data: user, error: userError }, { data: tournaments }] = await Promise.all([
		me(),
		getUserTournamentStaffMember(),
	]);
	if (userError || !user) {
		return { isAuthenticated: true, canAccess: false, isAdmin: false };
	}
	const isAdmin = user.roles?.some((role) => role.name === "ROLE_ADMIN") ?? false;
	const hasStaffTournament = (tournaments?.length ?? 0) > 0;
	return {
		isAuthenticated: true,
		canAccess: isAdmin || hasStaffTournament,
		isAdmin,
	};
});

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

export async function canAccessDashboard(): Promise<boolean> {
	const access = await resolveDashboardAccess();
	return access.canAccess;
}

export async function isGlobalAdmin(): Promise<boolean> {
	const access = await resolveDashboardAccess();
	return access.isAdmin;
}

export async function requireDashboardAccess(): Promise<void> {
	await requireAuth();
	const access = await resolveDashboardAccess();
	if (!access.canAccess) {
		redirect("/403");
	}
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
