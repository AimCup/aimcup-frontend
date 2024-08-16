import React from "react";
import { cookies } from "next/headers";
import { client, getTeamsByTournament } from "../../../../../../client";
import { TeamCard } from "@ui/molecules/Cards/TeamCard";
import Section from "@ui/atoms/Section/Section";
import { getUser } from "@/actions/public/getUserAction";

const SingleTournamentTeams = async ({
	params: { tournamentId },
}: {
	params: {
		tournamentId: string;
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
	const { data: getTeams } = await getTeamsByTournament({
		path: {
			abbreviation: tournamentId,
		},
	});
	const userData = await getUser();

	const findMyTeam = getTeams?.find((team) =>
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
					{getTeams
						?.sort((a, b) => {
							// sort array by averagePerformancePoints, descending
							return (
								(b?.averagePerformancePoints || 0) -
								(a?.averagePerformancePoints || 0)
							);
						})
						.map((team) => (
							<TeamCard tournamentAbb={tournamentId} team={team} key={team.id} />
						))}
				</div>
			</Section>
		</>
	);
};

export default SingleTournamentTeams;
