"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import {
	FiAward,
	FiCalendar,
	FiCheckSquare,
	FiDollarSign,
	FiGitMerge,
	FiHome,
	FiLayers,
	FiSettings,
	FiUser,
	FiUsers,
} from "react-icons/fi";
import { type IconType } from "react-icons";

interface NavItem {
	slug: string;
	label: string;
	icon: IconType;
	exact?: boolean;
}

export interface DashboardSidebarProps {
	tournamentAbbreviation: string;
	tournamentName?: string;
	/** Raw tournamentType enum value, e.g. "PARTICIPANT_VS" | "AUCTION" | "TEAM_VS". */
	tournamentTypeValue?: string;
}

function buildNavItems(tournamentTypeValue?: string): NavItem[] {
	const items: NavItem[] = [
		{ slug: "", label: "Home", icon: FiHome, exact: true },
		{ slug: "staff-members", label: "Staff members", icon: FiUsers },
		{ slug: "stages", label: "Stages", icon: FiLayers },
		{ slug: "qualification-rooms", label: "Qualification rooms", icon: FiCheckSquare },
		{ slug: "qualification-result", label: "Qualification results", icon: FiAward },
		{ slug: "matches", label: "Matches", icon: FiCalendar },
		{ slug: "bracket", label: "Bracket editor", icon: FiGitMerge },
	];

	if (tournamentTypeValue === "PARTICIPANT_VS") {
		items.push({ slug: "participants", label: "Participants", icon: FiUser });
	} else {
		items.push({ slug: "teams", label: "Teams", icon: FiUsers });
	}

	items.push({ slug: "settings", label: "Settings", icon: FiSettings });

	if (tournamentTypeValue === "AUCTION") {
		items.push({ slug: "auction", label: "Auction", icon: FiDollarSign });
	}

	return items;
}

export default function DashboardSidebar({
	tournamentAbbreviation,
	tournamentName,
	tournamentTypeValue,
}: DashboardSidebarProps) {
	const pathname = usePathname();
	const base = `/dashboard/${tournamentAbbreviation}`;
	const items = buildNavItems(tournamentTypeValue);

	const isActive = (item: NavItem) => {
		const href = item.slug ? `${base}/${item.slug}` : base;
		if (item.exact) {
			return pathname === href;
		}
		return pathname === href || pathname?.startsWith(`${href}/`);
	};

	const linkClasses = (active: boolean) =>
		twMerge(
			"flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
			active
				? "bg-deepRed/20 font-semibold text-white"
				: "text-white/60 hover:bg-white/5 hover:text-white",
		);

	return (
		<>
			{/* Desktop sidebar */}
			<aside className="hidden w-64 shrink-0 md:block">
				<div className="sticky top-4 flex flex-col gap-4">
					<div className="rounded-xl border border-white/[0.06] bg-tuned p-4">
						<p className="text-[11px] uppercase tracking-wide text-white/40">Managing</p>
						<p className="mt-1 truncate font-bold text-white" title={tournamentName}>
							{tournamentName || tournamentAbbreviation}
						</p>
					</div>
					<nav className="flex flex-col gap-1 rounded-xl border border-white/[0.06] bg-tuned p-2">
						{items.map((item) => {
							const href = item.slug ? `${base}/${item.slug}` : base;
							const active = isActive(item);
							const Icon = item.icon;
							return (
								<Link key={item.slug || "home"} href={href} className={linkClasses(active)}>
									<Icon size={17} />
									{item.label}
								</Link>
							);
						})}
					</nav>
				</div>
			</aside>

			{/* Mobile horizontal nav */}
			<nav className="-mx-1 flex gap-1 overflow-x-auto whitespace-nowrap pb-2 md:hidden">
				{items.map((item) => {
					const href = item.slug ? `${base}/${item.slug}` : base;
					const active = isActive(item);
					const Icon = item.icon;
					return (
						<Link
							key={item.slug || "home"}
							href={href}
							className={twMerge(
								"flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm transition",
								active
									? "bg-deepRed/20 font-semibold text-white"
									: "text-white/60 hover:bg-white/5 hover:text-white",
							)}
						>
							<Icon size={16} />
							{item.label}
						</Link>
					);
				})}
			</nav>
		</>
	);
}
