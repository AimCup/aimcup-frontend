import React from "react";
import { getTournamentByAbbreviation } from "../../../../../../client";
import DashboardSidebar from "./DashboardSidebar";
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
		<div className="flex w-full flex-col gap-6 md:flex-row md:gap-8">
			<DashboardSidebar
				tournamentAbbreviation={tournamentAbbreviation}
				tournamentName={tournamentData?.name}
				tournamentTypeValue={tournamentData?.tournamentType}
			/>
			<main className="min-w-0 flex-1">{children}</main>
		</div>
	);
}
