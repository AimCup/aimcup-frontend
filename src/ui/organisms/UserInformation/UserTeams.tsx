import React from "react";
import { UserService } from "../../../../generated";
import { TeamCard } from "@ui/molecules/Cards/TeamCard";
import { executeFetch } from "@/lib/executeFetch";

const UserTeams = async () => {
	const userTeams = await executeFetch(UserService.getUserTeams());
	if (!userTeams.status) {
		return <div>{userTeams.errorMessage}</div>;
	}
	return userTeams.response.map((team) => (
		<TeamCard key={team.id} team={team} tournamentAbb={team.tournamentAbbreviation} />
	));
};

export default UserTeams;
