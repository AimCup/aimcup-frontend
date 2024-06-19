import React from "react";
import Image from "next/image";
import NextTopLoader from "nextjs-toploader";
import { TournamentNavbar } from "@ui/organisms/Navbar/TournamentNavbar";

type ITournamentLayout = {
	children: React.ReactNode;
	params: { tournamentId: string };
};

export default function Layout({ children, params }: ITournamentLayout) {
	return (
		<>
			<NextTopLoader color="#CA191B" height={5} showSpinner={false} />
			<TournamentNavbar tournamentId={params.tournamentId} />
			<section className={"relative h-96 w-full"}>
				<Image
					src="/placeholder.png"
					alt="aimcup logo"
					className="h-full w-full object-cover"
					layout="fill"
				/>
			</section>
			<div className={""}>{children}</div>
		</>
	);
}
