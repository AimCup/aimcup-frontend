import React from "react";
import Image from "next/image";
import { ActiveLink } from "@ui/atoms/ActiveLink/ActiveLink";
import { LoginAvatar } from "@ui/molecules/LoginAvatar/LoginAvatar";

type ITournamentNavbar = {
	tournamentId: string;
};

export const TournamentNavbar = (props: ITournamentNavbar) => {
	return (
		<>
			<nav className="md:px-18 flex h-16 w-full items-center justify-between bg-deepCharcoal px-8 lg:px-20">
				<div className="flex-1">
					<a href={"/#"}>
						<Image src="/small-logo.svg" alt="Logo" width={30} height={24} />
					</a>
				</div>
				<div className={"hidden md:flex"}>
					<ul className="menu menu-horizontal gap-2 px-1">
						<li>
							<ActiveLink href={`/tournament/${props.tournamentId}`}>Home</ActiveLink>
						</li>
						<li>
							<ActiveLink href={`/tournament/${props.tournamentId}/rules`}>
								Rules
							</ActiveLink>
						</li>
						<li>
							<ActiveLink href={`/tournament/${props.tournamentId}/schedule`}>
								Schedule
							</ActiveLink>
						</li>
						<li>
							<ActiveLink href={`/tournament/${props.tournamentId}/mappool`}>
								Mappool
							</ActiveLink>
						</li>
						<li>
							{/* TODO: W zależności czy jest to turniej TEAM_VS/INTERNATIONAL czy PARTICIPANT_VS to będzie /teams lub /participants */}
							<ActiveLink href={`/tournament/${props.tournamentId}/teams`}>
								Teams / Participants
							</ActiveLink>
						</li>
						<li>
							<ActiveLink href={`/tournament/${props.tournamentId}/rules`}>
								Staff
							</ActiveLink>
						</li>
					</ul>
				</div>
				<LoginAvatar isLogged={false} />
			</nav>
		</>
	);
};
