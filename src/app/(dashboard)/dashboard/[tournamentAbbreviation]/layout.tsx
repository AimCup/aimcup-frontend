import React from "react";
import Image from "next/image";
import { StageService, TournamentRequestDto, TournamentService } from "../../../../../generated";
import { type INavbarProps } from "@ui/organisms/Navbar/Navbar";
import { stageTypeEnumToString } from "@/lib/helpers";
import tournamentType = TournamentRequestDto.tournamentType;

type ITournamentLayout = {
	children: React.ReactNode;
	params: { tournamentAbbreviation: string };
};

// todo: przy tak długiej navbar liscie trzeba poprawić responsywność :-)
const navbarRoutes: INavbarProps[] = [
	{ name: "Home", href: "/" },
	{ name: "Rules", href: "/rules" },
	{ name: "Schedule", href: "/schedule" },
	{
		name: "Mappool",
		href: "",
	},
	// { name: "Teams", href: "/teams" },
	// { name: "Participants", href: "/participants" },
	{ name: "Staff", href: "/staff" },
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

	const getStateTypes = getStagesData.value
		.filter((stage) => !!stage.mappool)
		.map((stage) => stage.stageType);

	const tournamentNavbarRoutes: INavbarProps[] = navbarRoutes.map((item) => {
		if (item.name === "Mappool") {
			return {
				...item,
				children: getStateTypes.map((stage) => ({
					name: stageTypeEnumToString(stage),
					href: `/tournament/${params.tournamentAbbreviation}/mappool/${stage}`,
				})),
			};
		}
		return {
			...item,
			href: `/tournament/${params.tournamentAbbreviation}${item.href}`,
		};
	});

	if (tournamentData.value?.tournamentType === tournamentType.TEAM_VS) {
		tournamentNavbarRoutes.push({ name: "Teams", href: "/teams" });
	} else if (tournamentData.value?.tournamentType === tournamentType.PARTICIPANT_VS) {
		tournamentNavbarRoutes.push({ name: "Participants", href: "/participants" });
	} else if (tournamentData.value?.tournamentType === tournamentType.INTERNATIONAL) {
		tournamentNavbarRoutes.push({ name: "INTERNATIONAL TODO", href: "" }); //todo
	}

	return (
		<>
			<section className={"relative h-96 w-full"}>
				<Image
					src={`${process.env.NEXT_PUBLIC_API_URL}/tournaments/${params.tournamentAbbreviation}/banner`}
					alt="aimcup logo"
					className="h-full w-full object-cover"
					fill={true}
				/>
			</section>
			<div className={""}>{children}</div>
		</>
	);
}
