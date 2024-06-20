import React from "react";
import Image from "next/image";
import NextTopLoader from "nextjs-toploader";
import { type INavbarProps, Navbar } from "@ui/organisms/Navbar/Navbar";
import { Footer } from "@ui/organisms/Footer/Footer";

type ITournamentLayout = {
	children: React.ReactNode;
	params: { tournamentId: string };
};

const navbarRoutes: INavbarProps[] = [
	{ name: "Home", href: "/" },
	{ name: "Rules", href: "/rules" },
	{ name: "Schedule", href: "/schedule" },
	{ name: "Mappool", href: "/mappool" },
	{ name: "Teams", href: "/teams" },
	{ name: "Participants", href: "/participants" },
	{ name: "Staff", href: "/staff" },
];

export default function Layout({ children, params }: ITournamentLayout) {
	const tournamentNavbarRoutes: INavbarProps[] = navbarRoutes.map((item) => {
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
					src="/placeholder.png"
					alt="aimcup logo"
					className="h-full w-full object-cover"
					layout="fill"
				/>
			</section>
			<div className={""}>{children}</div>
			<Footer />
		</>
	);
}
