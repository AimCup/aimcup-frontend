import React from "react";
import { StageService, TournamentRequestDto, TournamentService } from "../../../../../generated";
import { type INavbarProps } from "@ui/organisms/Navbar/Navbar";
import tournamentType = TournamentRequestDto.tournamentType;
import { Sidebar } from "@ui/organisms/Navbar/Sidebar";

type ITournamentLayout = {
	children: React.ReactNode;
	params: { tournamentAbbreviation: string };
};

// todo: przy tak długiej navbar liscie trzeba poprawić responsywność :-)
const navbarRoutes: INavbarProps[] = [
	{ name: "Home", href: "/" },
	{ name: "Settings", href: "/settings" },
	{ name: "Staff members", href: "/staff" },
	{ name: "Stages", href: "/stage" },
	{
		name: "Qualification",
		href: "/qualification-rooms",
		children: [
			{ name: "Rooms", href: "/qualification-rooms" },
			{ name: "Results", href: "/qualification-results" },
		],
	},
	{ name: "Mappool", href: "/mappool" },
	{ name: "Schedule", href: "/schedule" },
];

export default async function Layout({ children, params }: ITournamentLayout) {
	const [tournamentData, getStagesData] = await Promise.allSettled([
		TournamentService.getTournamentByAbbreviation(params.tournamentAbbreviation),
		StageService.getStages(params.tournamentAbbreviation),
	]);

	if (tournamentData.status === "rejected") {
		throw new Error("Tournament not found"); //todo: change to proper error
	}
	if (getStagesData.status === "rejected") {
		throw new Error("Shedule not found"); //todo: change to proper error
	}

	const tournamentNavbarRoutes: INavbarProps[] = navbarRoutes.map((item) => {
		if (item.children) {
			return {
				...item,
				children: item.children.map((child) => {
					return {
						...child,
						href: `/dashboard/${params.tournamentAbbreviation}${child.href}`,
					};
				}),
			};
		}
		return {
			...item,
			href: `/dashboard/${params.tournamentAbbreviation}${item.href}`,
		};
	});

	if (
		tournamentData.value?.tournamentType === tournamentType.TEAM_VS ||
		tournamentData.value?.tournamentType === tournamentType.INTERNATIONAL
	) {
		tournamentNavbarRoutes.push({
			name: "Teams",
			href: `/dashboard/${params.tournamentAbbreviation}/teams`,
		});
	} else if (tournamentData.value?.tournamentType === tournamentType.PARTICIPANT_VS) {
		tournamentNavbarRoutes.push({
			name: "Participants",
			href: `/dashboard/${params.tournamentAbbreviation}/participants`,
		});
	}

	return (
		<>
			<section className={"hidden grid-cols-2 gap-6 md:grid"}>
				<Sidebar routes={tournamentNavbarRoutes} />
				<div className={""}>{children}</div>
			</section>
		</>
	);
}
