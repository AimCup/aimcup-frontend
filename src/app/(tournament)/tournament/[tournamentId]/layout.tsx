import React from "react";
import Image from "next/image";
import NextTopLoader from "nextjs-toploader";
import { StageService } from "../../../../../generated";
import { type INavbarProps, Navbar } from "@ui/organisms/Navbar/Navbar";
import { Footer } from "@ui/organisms/Footer/Footer";
import { stageTypeEnumToString } from "@/lib/helpers";

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
	{ name: "Teams", href: "/teams" },
	{ name: "Participants", href: "/participants" },
	{ name: "Staff", href: "/staff" },
];

export default async function Layout({ children, params }: ITournamentLayout) {
	const getStagesData = await StageService.getStages(params.tournamentId);

	const getStateTypes = getStagesData
		.filter((stage) => !!stage.mappool)
		.map((stage) => stage.stageType);

	const tournamentNavbarRoutes: INavbarProps[] = navbarRoutes.map((item) => {
		if (item.name === "Mappool") {
			return {
				...item,
				children: getStateTypes.map((stage) => ({
					name: stageTypeEnumToString(stage),
					href: `/tournament/${params.tournamentId}/mappool/${stage}`,
				})),
			};
		}
		return {
			...item,
			href: `/tournament/${params.tournamentId}${item.href}`,
		};
	});

	return (
		<>
			<NextTopLoader color="#CA191B" height={5} showSpinner={false} />
			<Navbar routes={tournamentNavbarRoutes} />
			<section className={"relative h-96 w-full"}>
				<Image
					src={`${process.env.API_URL}/tournaments/${params.tournamentId}/banner`}
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
