import React from "react";
import { getTournamentByAbbreviation, tournamentType } from "../../../../../../client";
import {
	configureApiClient,
	requireStaffMember,
} from "@/lib/guards/staffMemberGuard";

export default async function Layout({
	children,
	params: { tournamentAbbreviation },
}: {
	children: React.ReactNode;
	params: {
		tournamentAbbreviation: string;
	};
}) {
	await requireStaffMember(tournamentAbbreviation);
	configureApiClient();

	const { data: tournamentData } = await getTournamentByAbbreviation({
		path: {
			abbreviation: tournamentAbbreviation,
		},
	});

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
					<li>
						<a href={`/dashboard/${tournamentAbbreviation}/bracket`}>Bracket editor</a>
					</li>
					{tournamentData?.tournamentType !== tournamentType.PARTICIPANT_VS ? (
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
					{tournamentData?.tournamentType === tournamentType.AUCTION && (
						<li>
							<a href={`/dashboard/${tournamentAbbreviation}/auction`}>Auction</a>
						</li>
					)}
				</ul>
			</nav>
			{children}
		</>
	);
}
