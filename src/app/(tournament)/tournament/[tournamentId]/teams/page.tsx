import React from "react";
import { TeamService } from "../../../../../../generated";
import { TeamCard } from "@ui/molecules/Cards/TeamCard";
import { executeFetch } from "@/lib/executeFetch";
import Section from "@ui/atoms/Section/Section";
import { getUser } from "@/actions/public/getUserAction";

const SingleTournamentTeams = async ({
	params: { tournamentId },
}: {
	params: {
		tournamentId: string;
	};
}) => {
	const getTeams = await executeFetch(TeamService.getTeamsByTournament(tournamentId));
	const userData = await getUser();
	if (!getTeams.status) {
		return <Section>{getTeams.errorMessage}</Section>;
	}

	const findMyTeam = getTeams.response.find((team) =>
		team.participants.some((participant) => participant.user.id === userData?.id),
	);

	return (
		<>
			{findMyTeam && (
				<Section className={"flex-col"}>
					<div className={"mb-10 flex"}>
						<div className={"flex flex-col gap-4 md:flex-row md:items-center"}>
							<h2 className={"text-4xl font-bold "}>Your team</h2>
						</div>
					</div>
					<div className={"grid grid-cols-1 gap-10 md:grid-cols-2"}>
						<TeamCard tournamentAbb={tournamentId} team={findMyTeam} />
					</div>
				</Section>
			)}
			<Section className={"flex-col"}>
				<div className={"mb-10 flex"}>
					<div className={"flex flex-col gap-4 md:flex-row md:items-center"}>
						<h2 className={"text-4xl font-bold "}>Teams</h2>
					</div>
				</div>
				<div className={"grid grid-cols-1 gap-10 md:grid-cols-2"}>
					{getTeams.response.map((team) => (
						<TeamCard tournamentAbb={tournamentId} team={team} key={team.id} />
					))}
				</div>
			</Section>
		</>
	);
};

export default SingleTournamentTeams;
