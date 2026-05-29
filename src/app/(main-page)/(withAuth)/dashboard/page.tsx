import React from "react";
import Link from "next/link";
import { getUserTournamentStaffMember } from "../../../../../client";
import CreateTournamentModal from "@/app/(main-page)/(withAuth)/dashboard/CreateTournamentModal";
import { configureApiClient, isGlobalAdmin } from "@/lib/guards/staffMemberGuard";

const DashboardPage = async () => {
	configureApiClient();
	const [{ data: tournaments }, isAdmin] = await Promise.all([
		getUserTournamentStaffMember(),
		isGlobalAdmin(),
	]);

	return (
		<div className={"w-full"}>
			<div className={"mb-4 flex items-center gap-4"}>
				<h1 className={"text-lg"}>Select tournament</h1>
				{isAdmin && (
					<Link
						href="/dashboard/custom-maps"
						className={
							"rounded-md bg-base-300 px-3 py-1 text-sm font-medium transition-all hover:brightness-110"
						}
					>
						Custom Maps
					</Link>
				)}
			</div>
			<div className={"grid gap-4 sm:grid-cols-1 lg:grid-cols-3"}>
				{isAdmin && <CreateTournamentModal />}
				{tournaments?.map((tournament) => (
					<Link
						href={`/dashboard/${tournament.abbreviation}`}
						key={tournament.abbreviation}
						className={"w-full shadow-lg"}
					>
						<div
							className={
								"flex h-64 w-full gap-2 rounded-md bg-opacity-20 bg-cover bg-center"
							}
							style={{
								backgroundImage: `url(${process.env.NEXT_PUBLIC_API_URL}/tournaments/${tournament.abbreviation}/banner)`,
							}}
						>
							<p
								style={{
									backgroundColor: "rgba(0, 0, 0, 0.7)",
								}}
								className={"m-1 self-end rounded-md bg-opacity-70 p-4"}
							>
								{tournament.name}
							</p>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
};

export default DashboardPage;
