import React from "react";
import { cookies } from "next/headers";
import { client, getTeams, getTournamentStaffMember } from "../../../../../../../client";
import { TeamsTable } from "./TeamsTable";

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
	const { data, error } = await getTeams({
		path: {
			abbreviation: tournamentAbbreviation,
		},
	});
	if (error) {
		return <div>Failed to fetch teams</div>;
	}

	const { data: getStaffForATournamentUser } = await getTournamentStaffMember({
		path: {
			abbreviation: tournamentAbbreviation,
		},
	});

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

	if (!data) {
		return <div>Failed to fetch teams</div>;
	}

	return (
		<TeamsTable
			teams={data}
			tournamentAbbreviation={tournamentAbbreviation}
			canUpdateTeam={canUpdateTeam || false}
			canDeleteTeam={canDeleteTeam || false}
			canChangeTeamStatus={canChangeTeamStatus || false}
		/>
	);
};

export default TeamsPage;
