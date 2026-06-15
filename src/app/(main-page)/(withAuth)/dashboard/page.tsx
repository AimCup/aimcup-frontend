import React from "react";
import Link from "next/link";
import { getUserTournamentStaffMember } from "../../../../../client";
import CreateTournamentModal from "@/app/(main-page)/(withAuth)/dashboard/CreateTournamentModal";
import { configureApiClient, isGlobalAdmin } from "@/lib/guards/staffMemberGuard";
import { PageHeader } from "@ui/molecules/PageHeader/PageHeader";
import { Card } from "@ui/atoms/Card/Card";
import { FiMap } from "react-icons/fi";

const DashboardPage = async () => {
	configureApiClient();
	const [{ data: tournaments }, isAdmin] = await Promise.all([
		getUserTournamentStaffMember(),
		isGlobalAdmin(),
	]);

	const hasTournaments = (tournaments?.length ?? 0) > 0;

	return (
		<div className="flex w-full flex-col gap-6">
			<PageHeader
				title="Tournaments"
				subtitle="Select a tournament to manage, or create a new one."
				actions={
					isAdmin ? (
						<Link
							href="/dashboard/custom-maps"
							className="flex items-center gap-2 rounded-md bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition-all hover:bg-white/10 hover:text-white"
						>
							<FiMap size={14} />
							Custom Maps
						</Link>
					) : undefined
				}
			/>

			<Card title="Your tournaments" headerAction={isAdmin ? <CreateTournamentModal /> : undefined}>
				{hasTournaments ? (
					<div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
						{tournaments?.map((tournament) => (
							<Link
								href={`/dashboard/${tournament.abbreviation}`}
								key={tournament.abbreviation}
								className="group w-full shadow-lg"
							>
								<div
									className="flex h-56 w-full rounded-xl bg-cover bg-center transition-all duration-200 group-hover:ring-2 group-hover:ring-white/20"
									style={{
										backgroundImage: `url(${process.env.NEXT_PUBLIC_API_URL}/tournaments/${tournament.abbreviation}/banner)`,
									}}
								>
									<p
										className="m-2 self-end rounded-lg p-3 text-sm font-semibold text-white"
										style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
									>
										{tournament.name}
									</p>
								</div>
							</Link>
						))}
					</div>
				) : (
					<p className="py-10 text-center text-white/40">
						{isAdmin
							? "No tournaments yet. Create one to get started."
							: "You are not a staff member of any tournament yet."}
					</p>
				)}
			</Card>
		</div>
	);
};

export default DashboardPage;
