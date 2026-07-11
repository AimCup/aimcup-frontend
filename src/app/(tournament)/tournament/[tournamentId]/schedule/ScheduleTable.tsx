"use client";

import React, { useCallback, useMemo, useState } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { type MatchResponseDto } from "../../../../../../client";
import { stageTypeEnumToString } from "@/lib/helpers";
import { RescheduleMatchModal } from "@/app/(main-page)/(withAuth)/dashboard/[tournamentAbbreviation]/matches/RescheduleMatchModal";

type SortKey = "id" | "time";
type StageType = NonNullable<MatchResponseDto["stage"]>["stageType"];

// Natural (human) ordering: "1" < "2" < "10" and "SW1" < "SW2" < "SW9-1" < "SW9-2" < "SW10".
// numeric:true makes embedded numbers compare as numbers instead of character-by-character.
const matchIdCollator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

// A "potential" match is a conditional/bracket-dependent match whose id carries a dash,
// e.g. "SW9-1" / "SW9-2". These can be hidden via the toggle so the schedule shows only confirmed matches.
const isPotentialMatch = (match: MatchResponseDto) => (match.matchId ?? "").includes("-");

// Finished matches are grouped by stage so the list isn't a flat wall of rows. Every Swiss round
// collapses into one "Swiss Stage" group; all other stages (Quarter Final, Grand Final, …) stand alone.
const isSwiss = (stageType?: string) => !!stageType && stageType.startsWith("SWISS");
const groupKeyFor = (stageType?: string) => (isSwiss(stageType) ? "SWISS" : stageType ?? "UNKNOWN");
const groupLabelFor = (stageType?: string) =>
	isSwiss(stageType)
		? "Swiss Stage"
		: stageType
			? stageTypeEnumToString(stageType as StageType)
			: "Unknown stage";

// Rough stage progression used to order the finished groups top-to-bottom.
const STAGE_ORDER = [
	"QUALIFICATION",
	"SWISS",
	"RO128",
	"RO64",
	"RO32",
	"RO16",
	"QUARTER_FINAL",
	"SEMI_FINAL",
	"FINAL",
	"GRAND_FINAL",
];
const stageOrderIndex = (key: string) => {
	const i = STAGE_ORDER.indexOf(key);
	return i === -1 ? STAGE_ORDER.length : i;
};

export const ScheduleTable = ({
	matches,
	finishedMatches,
	tournamentId,
	currentUserId,
}: {
	matches: MatchResponseDto[];
	finishedMatches: MatchResponseDto[];
	tournamentId: string;
	currentUserId?: string;
}) => {
	const [sortKey, setSortKey] = useState<SortKey>("id");
	const [showPotential, setShowPotential] = useState(true);
	const [showFinished, setShowFinished] = useState(false);
	// Finished-stage groups the viewer has expanded (keyed by group key). Empty = all collapsed (default).
	const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

	const toggleGroup = (key: string) =>
		setExpandedGroups((prev) => {
			const next = new Set(prev);
			if (next.has(key)) {
				next.delete(key);
			} else {
				next.add(key);
			}
			return next;
		});

	const upcomingMatches = useMemo(
		() => matches.filter((match) => match.matchResult == null),
		[matches],
	);

	const potentialCount = useMemo(
		() => upcomingMatches.filter(isPotentialMatch).length,
		[upcomingMatches],
	);

	// The only public action is a captain rescheduling their own match. Non-captains (regular
	// viewers, host/staff) have no action here — staff actions live in the dashboard instead.
	const isViewerCaptain = useCallback(
		(match: MatchResponseDto) =>
			!!currentUserId &&
			(match.teamRed?.captain?.user?.id === currentUserId ||
				match.teamBlue?.captain?.user?.id === currentUserId),
		[currentUserId],
	);

	const hasActions = useMemo(
		() => upcomingMatches.some(isViewerCaptain),
		[upcomingMatches, isViewerCaptain],
	);

	const sortedMatches = useMemo(() => {
		const visible = showPotential
			? upcomingMatches
			: upcomingMatches.filter((match) => !isPotentialMatch(match));
		return [...visible].sort((a, b) => {
			if (sortKey === "id") {
				return matchIdCollator.compare(a.matchId ?? "", b.matchId ?? "");
			}
			return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
		});
	}, [upcomingMatches, sortKey, showPotential]);

	// Group finished matches by stage (Swiss collapsed), order groups by progression, and sort each
	// group's matches by natural match-id order.
	const finishedGroups = useMemo(() => {
		const byStage = new Map<string, MatchResponseDto[]>();
		for (const match of finishedMatches) {
			const key = groupKeyFor(match.stage?.stageType);
			const list = byStage.get(key);
			if (list) {
				list.push(match);
			} else {
				byStage.set(key, [match]);
			}
		}
		return [...byStage.entries()]
			.sort((a, b) => stageOrderIndex(a[0]) - stageOrderIndex(b[0]))
			.map(([key, list]) => ({
				key,
				label: groupLabelFor(list[0].stage?.stageType),
				matches: [...list].sort((a, b) =>
					matchIdCollator.compare(a.matchId ?? "", b.matchId ?? ""),
				),
			}));
	}, [finishedMatches]);

	const SortHeader = ({ label, column }: { label: string; column: SortKey }) => (
		<th>
			<button
				type="button"
				onClick={() => setSortKey(column)}
				className={`flex items-center gap-1 ${sortKey === column ? "font-bold" : "opacity-70"}`}
			>
				{label}
				<span className="text-xs">{sortKey === column ? "▾" : ""}</span>
			</button>
		</th>
	);

	return (
		<div className="mt-3">
			<div className="mb-3 flex flex-wrap items-center justify-end gap-2">
				{potentialCount > 0 && (
					<button
						type="button"
						onClick={() => setShowPotential((prev) => !prev)}
						className="rounded-md border border-deepRed/40 px-3 py-1.5 text-sm font-medium transition hover:bg-deepRed/10"
					>
						{showPotential
							? `Hide potential matches (${potentialCount})`
							: `Show potential matches (${potentialCount})`}
					</button>
				)}
				{finishedMatches.length > 0 && (
					<button
						type="button"
						onClick={() => setShowFinished((prev) => !prev)}
						className="rounded-md border border-mintGreen/40 px-3 py-1.5 text-sm font-medium transition hover:bg-mintGreen/10"
					>
						{showFinished
							? "Hide finished matches"
							: `Show finished matches (${finishedMatches.length})`}
					</button>
				)}
			</div>
			<div className="overflow-x-auto">
				<table className="table table-zebra text-base">
					<thead>
					<tr>
						<SortHeader label="Match ID" column="id" />
						<SortHeader label="Start date time (UTC+0)" column="time" />
						<th>Stage</th>
						<th>Team blue</th>
						<th>Team red</th>
						<th>Referee</th>
						<th>Commentators</th>
						<th>Streamers</th>
						{hasActions && <th>Action</th>}
					</tr>
				</thead>
				<tbody>
					{sortedMatches.map((match) => (
						<tr key={match.id}>
							<td>{match.matchId}</td>
							<td>{format(new Date(match.startDate), "dd/MM/yyyy HH:mm")}</td>
							<td>{match.stage?.stageType}</td>
							<td>
								<Link href={`/tournament/${tournamentId}/teams/${match.teamBlue.id}`}>
									{match.teamBlue.name}
								</Link>
							</td>
							<td>
								<Link href={`/tournament/${tournamentId}/teams/${match.teamRed.id}`}>
									{match.teamRed.name}
								</Link>
							</td>
							<td>
								{match.referees?.map((referee) => (
									<div key={referee?.user?.id}>{referee?.user?.username}</div>
								))}
							</td>
							<td>
								{match.commentators?.map((commentator) => (
									<div key={commentator?.user?.id}>{commentator.user?.username}</div>
								))}
							</td>
							<td>
								{match.streamers?.map((streamer) => (
									<div key={streamer?.user?.id}>{streamer?.user?.username}</div>
								))}
							</td>
							{hasActions && (
								<td>
									{isViewerCaptain(match) && (
										<RescheduleMatchModal
											tournamentAbb={tournamentId}
											matchId={match.id}
											currentMatchDate={new Date(match.startDate)
												.toISOString()
												.slice(0, 16)}
										/>
									)}
								</td>
							)}
						</tr>
					))}
				</tbody>
			</table>
		</div>

			{showFinished && (
				<div className="mt-8 flex flex-col gap-8">
					{finishedGroups.map((group) => {
						const collapsed = !expandedGroups.has(group.key);
						return (
						<div key={group.key}>
							<button
								type="button"
								onClick={() => toggleGroup(group.key)}
								className="mb-2 flex items-center gap-2 text-xl font-bold"
								aria-expanded={!collapsed}
							>
								<span className="text-sm">{collapsed ? "▸" : "▾"}</span>
								{group.label}
								<span className="text-sm font-normal opacity-60">
									({group.matches.length})
								</span>
							</button>
							{!collapsed && (
							<div className="overflow-x-auto">
								<table className="table table-zebra text-base">
									<thead>
										<tr>
											<th>Match ID</th>
											<th>Date (UTC+0)</th>
											<th>Team blue</th>
											<th>Score</th>
											<th>Team red</th>
											<th>MP</th>
										</tr>
									</thead>
									<tbody>
										{group.matches.map((match) => {
											const result = match.matchResult;
											const blueWon = !!result && result.blueScore > result.redScore;
											const redWon = !!result && result.redScore > result.blueScore;
											return (
												<tr key={match.id}>
													<td>{match.matchId}</td>
													<td>
														{format(new Date(match.startDate), "dd/MM/yyyy HH:mm")}
													</td>
													<td className={blueWon ? "font-bold" : ""}>
														<Link href={`/tournament/${tournamentId}/teams/${match.teamBlue.id}`}>
															{match.teamBlue.name}
														</Link>
													</td>
													<td className="whitespace-nowrap tabular-nums">
														{result ? `${result.blueScore} - ${result.redScore}` : "-"}
													</td>
													<td className={redWon ? "font-bold" : ""}>
														<Link href={`/tournament/${tournamentId}/teams/${match.teamRed.id}`}>
															{match.teamRed.name}
														</Link>
													</td>
													<td>
														{result?.mpUrl ? (
															<a
																href={result.mpUrl}
																target="_blank"
																rel="noopener noreferrer"
																className="text-mintGreen underline"
															>
																MP
															</a>
														) : (
															"-"
														)}
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
							)}
						</div>
						);
					})}
				</div>
			)}
	</div>
	);
};
