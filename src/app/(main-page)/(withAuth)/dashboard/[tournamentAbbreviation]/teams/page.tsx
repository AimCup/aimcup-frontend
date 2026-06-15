import React from "react";
import { cookies } from "next/headers";
import {
	client,
	getTeams,
	getTournamentStaffMember,
} from "../../../../../../../client";
import { TeamsTable } from "./TeamsTable";
import { PageHeader } from "@ui/molecules/PageHeader/PageHeader";
import { Card } from "@ui/atoms/Card/Card";

const TeamsPage = async ({
	params: { tournamentAbbreviation },
}: {
	params: {
		tournamentAbbreviation: string;
	};
}) => {
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

	// Fetch all independent data in parallel.
	const [{ data, error }, { data: getStaffForATournamentUser }] =
		await Promise.all([
			getTeams({ path: { abbreviation: tournamentAbbreviation } }),
			getTournamentStaffMember({ path: { abbreviation: tournamentAbbreviation } }),
		]);

	if (error || !data) {
		return (
			<div className="flex w-full flex-col gap-6">
				<PageHeader title="Teams" subtitle="Manage tournament teams and rosters." />
				<Card>
					<p className="text-white/40">Failed to fetch teams.</p>
				</Card>
			</div>
		);
	}

	// Check permissions
	const canUpdateTeam =
		getStaffForATournamentUser?.permissions?.some((permission) => {
			return permission === "TEAM_UPDATE";
		}) ||
		getStaffForATournamentUser?.roles?.some((role) =>
			role.permissions.some((permission) => permission === "TEAM_UPDATE"),
		);

	const canDeleteTeam =
		getStaffForATournamentUser?.permissions?.some((permission) => {
			return permission === "TEAM_DELETE";
		}) ||
		getStaffForATournamentUser?.roles?.some((role) =>
			role.permissions.some((permission) => permission === "TEAM_DELETE"),
		);

	const canChangeTeamStatus =
		getStaffForATournamentUser?.permissions?.some((permission) => {
			return permission === "TEAM_STATUS_UPDATE";
		}) ||
		getStaffForATournamentUser?.roles?.some((role) =>
			role.permissions.some((permission) => permission === "TEAM_STATUS_UPDATE"),
		);

	return (
		<div className="flex w-full flex-col gap-6">
			<PageHeader
				title="Teams"
				subtitle="Manage tournament teams and rosters."
			/>

			<Card className="p-0">
				<TeamsTable
					teams={data}
					tournamentAbbreviation={tournamentAbbreviation}
					canUpdateTeam={canUpdateTeam || false}
					canDeleteTeam={canDeleteTeam || false}
					canChangeTeamStatus={canChangeTeamStatus || false}
				/>
			</Card>
		</div>
	);
};

export default TeamsPage;
