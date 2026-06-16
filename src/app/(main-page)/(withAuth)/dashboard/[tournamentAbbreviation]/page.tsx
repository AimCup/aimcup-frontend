import React from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import {
	FiAward,
	FiCalendar,
	FiCheckSquare,
	FiDollarSign,
	FiGitMerge,
	FiLayers,
	FiUser,
	FiUsers,
} from "react-icons/fi";
import {
	client,
	getMatches,
	getStaffMembers,
	getStages,
	getTournamentByAbbreviation,
	tournamentType,
} from "../../../../../../client";
import { PageHeader } from "@ui/molecules/PageHeader/PageHeader";
import { Card } from "@ui/atoms/Card/Card";

const DashboardHome = async ({
	params: { tournamentAbbreviation },
}: {
	params: {
		tournamentAbbreviation: string;
	};
}) => {
	const cookie = cookies().get("JWT")?.value;
	client.setConfig({
		baseUrl: process.env.NEXT_PUBLIC_API_URL,
		headers: {
			Cookie: `token=${cookie}`,
		},
	});

	const [
		{ data: tournament },
		{ data: matches },
		{ data: staffMembers },
		{ data: stages },
	] = await Promise.all([
		getTournamentByAbbreviation({ path: { abbreviation: tournamentAbbreviation } }),
		getMatches({ path: { abbreviation: tournamentAbbreviation } }),
		getStaffMembers({ path: { abbreviation: tournamentAbbreviation } }),
		getStages({ path: { abbreviation: tournamentAbbreviation } }),
	]);

	const isParticipantBased =
		tournament?.tournamentType === tournamentType.PARTICIPANT_VS;
	// "AUCTION" is not yet in the generated client enum (stale client); cast to string to compare safely.
	const isAuction = (tournament?.tournamentType as string | undefined) === "AUCTION";

	const base = `/dashboard/${tournamentAbbreviation}`;

	const matchesWithoutReferee = (matches ?? []).filter(
		(m) => !m.referees || m.referees.length === 0,
	);

	const uniqueStaffCount = staffMembers?.length ?? 0;
	const matchCount = matches?.length ?? 0;
	const currentStageName = tournament?.currentStage ?? null;

	interface QuickLink {
		href: string;
		label: string;
		description: string;
		icon: React.ElementType;
	}

	const quickLinks: QuickLink[] = [
		{
			href: `${base}/staff-members`,
			label: "Staff members",
			description: `${uniqueStaffCount} member${uniqueStaffCount !== 1 ? "s" : ""} registered`,
			icon: FiUsers,
		},
		{
			href: `${base}/stages`,
			label: "Stages",
			description: `${stages?.length ?? 0} stage${(stages?.length ?? 0) !== 1 ? "s" : ""} configured`,
			icon: FiLayers,
		},
		{
			href: `${base}/qualification-rooms`,
			label: "Qualification rooms",
			description: "Manage rooms and referees",
			icon: FiCheckSquare,
		},
		{
			href: `${base}/qualification-results`,
			label: "Qualification results",
			description: "View seeding results",
			icon: FiAward,
		},
		{
			href: `${base}/matches`,
			label: "Matches",
			description: `${matchCount} match${matchCount !== 1 ? "es" : ""} · ${matchesWithoutReferee.length} without referee`,
			icon: FiCalendar,
		},
		{
			href: `${base}/bracket`,
			label: "Bracket editor",
			description: "Edit tournament bracket",
			icon: FiGitMerge,
		},
		...(isParticipantBased
			? [
					{
						href: `${base}/participants`,
						label: "Participants",
						description: "Manage individual participants",
						icon: FiUser,
					} satisfies QuickLink,
				]
			: [
					{
						href: `${base}/teams`,
						label: "Teams",
						description: "Manage registered teams",
						icon: FiUsers,
					} satisfies QuickLink,
				]),
		...(isAuction
			? [
					{
						href: `${base}/auction`,
						label: "Auction",
						description: "Run the live auction",
						icon: FiDollarSign,
					} satisfies QuickLink,
				]
			: []),
	];

	return (
		<div className="flex w-full flex-col gap-6">
			<PageHeader
				title={tournament?.name ?? tournamentAbbreviation}
				subtitle={
					currentStageName
						? `Current stage: ${currentStageName.replace(/_/g, " ")}`
						: "Tournament overview"
				}
			/>

			<Card
				title="Welcome to the admin dashboard"
				className="pb-2"
			>
				<p className="mb-6 text-sm text-white/50">
					Use the sidebar or the quick-links below to manage every aspect of{" "}
					<span className="font-semibold text-white/80">
						{tournament?.name ?? tournamentAbbreviation}
					</span>
					.
				</p>

				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{quickLinks.map((link) => {
						const Icon = link.icon;
						return (
							<Link
								key={link.href}
								href={link.href}
								className="group flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-4 transition hover:border-white/10 hover:bg-white/[0.06]"
							>
								<span className="mt-0.5 shrink-0 rounded-lg bg-deepRed/20 p-2 text-deepRed transition group-hover:bg-deepRed/30">
									<Icon size={16} />
								</span>
								<div className="min-w-0">
									<p className="text-sm font-semibold text-white">{link.label}</p>
									<p className="mt-0.5 truncate text-xs text-white/40">{link.description}</p>
								</div>
							</Link>
						);
					})}
				</div>
			</Card>
		</div>
	);
};

export default DashboardHome;
