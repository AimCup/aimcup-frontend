import React from "react";
import Image from "next/image";
import NextTopLoader from "nextjs-toploader";
import { StageService, TournamentRequestDto, TournamentService } from "../../../../../generated";
import { type INavbarProps, Navbar } from "@ui/organisms/Navbar/Navbar";
import { Footer } from "@ui/organisms/Footer/Footer";
import { stageTypeEnumToString } from "@/lib/helpers";
import tournamentType = TournamentRequestDto.tournamentType;
import { LoginAvatar } from "@ui/molecules/LoginAvatar/LoginAvatar";
import { executeFetch } from "@/lib/executeFetch";
import Section from "@ui/atoms/Section/Section";

type ITournamentLayout = {
	children: React.ReactNode;
	params: { tournamentId: string };
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
	const getStagesData = await executeFetch(StageService.getStages(params.tournamentId));

	const tournamentData = await executeFetch(
		TournamentService.getTournamentByAbbreviation(params.tournamentId),
	);

	if (!tournamentData.status) {
		<Section>{tournamentData.errorMessage}</Section>;
	}
	if (!getStagesData.status) {
		<Section>{getStagesData.errorMessage}</Section>;
	}

	const getStateTypes =
		getStagesData.status &&
		getStagesData.response.filter((stage) => !!stage.mappool).map((stage) => stage.stageType);

	const tournamentNavbarRoutes: INavbarProps[] = navbarRoutes.map((item) => {
		if (item.name === "Mappool") {
			return {
				...item,
				children:
					getStateTypes &&
					getStateTypes.map((stage) => ({
						name: stageTypeEnumToString(stage),
						href: `/tournament/${params.tournamentId}/mappool/${stage}`,
					})),
			};
		}
		return {
			...item,
			href: `/tournament/${params.tournamentId}${item.href}`,
		};
	}) as INavbarProps[];

	if (
		tournamentData.status &&
		tournamentData.response?.tournamentType !== tournamentType.PARTICIPANT_VS
	) {
		tournamentNavbarRoutes.push({
			name: "Teams",
			href: `/tournament/${params.tournamentId}/teams`,
		});
	} else {
		tournamentNavbarRoutes.push({
			name: "Participants",
			href: `/tournament/${params.tournamentId}/participants`,
		});
	}

	return (
		<>
			<NextTopLoader color="#CA191B" height={5} showSpinner={false} />
			<Navbar routes={tournamentNavbarRoutes}>
				<LoginAvatar />
			</Navbar>
			<section className={"relative h-96 w-full"}>
				<Image
					src={`${process.env.NEXT_PUBLIC_API_URL}/tournaments/${params.tournamentId}/banner`}
					alt="aimcup logo"
					className="h-full w-full object-cover"
					fill={true}
				/>
			</section>
			<div className={""}>{children}</div>
			<Footer />
		</>
	);
}
