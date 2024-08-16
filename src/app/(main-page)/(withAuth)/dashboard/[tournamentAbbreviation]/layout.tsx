import React from "react";
import { cookies } from "next/headers";
import { client, getTournamentByAbbreviation, tournamentType } from "../../../../../../client";

export default async function Layout({
	children,
	params: { tournamentAbbreviation },
}: {
	children: React.ReactNode;
	params: {
		tournamentAbbreviation: string;
	};
}) {
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
				</ul>
			</nav>
			{children}
		</>
	);
}
