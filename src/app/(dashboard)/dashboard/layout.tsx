import React from "react";
import NextTopLoader from "nextjs-toploader";
import { Footer } from "@ui/organisms/Footer/Footer";
import { AuthGuard } from "@/lib/Providers/AuthGuard";
import { Navbar } from "@ui/organisms/Navbar/Navbar";

export type INavbarProps = {
	name: string;
	href: string;
	children?: { name: string; href: string }[];
};

type ITournamentLayout = {
	children: React.ReactNode;
	// params: { tournamentId: string };
};

const navbarRoutes: INavbarProps[] = [];

export default async function Layout({ children }: ITournamentLayout) {
	return (
		<AuthGuard>
			<NextTopLoader color="#CA191B" height={5} showSpinner={false} />
			<Navbar routes={navbarRoutes} />
			<div
				className={
					"divide-gray-700 md:px-18 md:py-18 flex w-full px-8 py-10 lg:px-20 lg:py-20"
				}
			>
				{children}
			</div>
			<Footer />
		</AuthGuard>
	);
}
