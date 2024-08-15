import React from "react";
import { TournamentRequestDto, TournamentService } from "../../../../../../generated";
import { executeFetch } from "@/lib/executeFetch";
import tournamentType = TournamentRequestDto.tournamentType;

export default async function Layout({
	children,
	params: { tournamentAbbreviation },
}: {
	children: React.ReactNode;
	params: {
		tournamentAbbreviation: string;
	};
}) {
	const tournamentData = await executeFetch(
		TournamentService.getTournamentByAbbreviation(tournamentAbbreviation),
	);

	if (!tournamentData.status) {
		return <>{tournamentData.errorMessage}</>;
	}

	return (
		<>
			<nav className="">
				<ul className="menu menu-vertical">
					<li>
						<a href={`/dashboard/${tournamentAbbreviation}`}>Home</a>
					</li>
					<li>
						<a href={`/dashboard/${tournamentAbbreviation}/staff-members`}>
							Staff members
						</a>
					</li>
					<li>
						<a href={`/dashboard/${tournamentAbbreviation}/stages`}>Stages</a>
					</li>
					<li>
						<a href={`/dashboard/${tournamentAbbreviation}/qualification-rooms`}>
							Qualification rooms
						</a>
					</li>
					<li>
						<a href={`/dashboard/${tournamentAbbreviation}/qualification-results`}>
							Qualification results
						</a>
					</li>
					<li>
						<a href={`/dashboard/${tournamentAbbreviation}/matches`}>Matches</a>
					</li>
					{tournamentData?.response.tournamentType !== tournamentType.PARTICIPANT_VS ? (
						<li>
							<a href={`/dashboard/${tournamentAbbreviation}/teams`}>Teams</a>
						</li>
					) : (
						<li>
							<a href={`/dashboard/${tournamentAbbreviation}/participants`}>
								Participants
							</a>
						</li>
					)}

					<li>
						<a href={`/dashboard/${tournamentAbbreviation}/settings`}>Settings</a>
					</li>
				</ul>
			</nav>
			{children}
		</>
	);
}
