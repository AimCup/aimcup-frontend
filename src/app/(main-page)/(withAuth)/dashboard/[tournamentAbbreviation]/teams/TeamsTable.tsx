"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { TeamResponseDto, ParticipantResponseDto } from "../../../../../../../client";
import { EditTeamModal } from "./EditTeamModal";
import { DeleteTeamModal } from "./DeleteTeamModal";
import { AvatarGroup } from "@ui/atoms/AvatarGroup/AvatarGroup";
import { changeTeamStatusAction } from "@/actions/admin/adminTeamActions";

function Spinner() {
	return <span className="loading loading-spinner loading-xs" />;
}

interface TeamsTableProps {
	teams: TeamResponseDto[];
	tournamentAbbreviation: string;
	canUpdateTeam: boolean;
	canDeleteTeam: boolean;
	canChangeTeamStatus: boolean;
}

export const TeamsTable = ({
	teams,
	tournamentAbbreviation,
	canUpdateTeam,
	canDeleteTeam,
	canChangeTeamStatus,
}: TeamsTableProps) => {
	const [isCompact, setIsCompact] = useState(false);
	const [pendingTeamId, setPendingTeamId] = useState<string | null>(null);
	const [, startTransition] = useTransition();
	const router = useRouter();

	const getNonCaptainParticipants = (team: TeamResponseDto): ParticipantResponseDto[] => {
		return team.participants.filter((participant) => participant.id !== team.captain.id);
	};

	const handleChangeTeamStatus = async (teamId: string, status: "ACCEPTED" | "REJECTED") => {
		setPendingTeamId(teamId);
		startTransition(async () => {
			const result = await changeTeamStatusAction(tournamentAbbreviation, teamId, status);
			setPendingTeamId(null);
			if (result.status) {
				toast.success(`Team status changed to ${status}`, { duration: 2500 });
				router.refresh();
			} else {
				toast.error(result.errorMessage || "Failed to change team status", { duration: 4000 });
			}
		});
	};

	return (
		<div className="overflow-x-auto">
			<div className="flex items-center justify-end px-5 py-4 sm:px-6">
				<label className="flex cursor-pointer items-center gap-2">
					<span className="label-text text-white/60">Compact</span>
					<input
						type="checkbox"
						className="toggle toggle-primary"
						checked={isCompact}
						onChange={(e) => setIsCompact(e.target.checked)}
					/>
				</label>
			</div>
			<table className="table w-full">
				<thead>
					<tr>
						<th>Team name</th>
						<th>Captain</th>
						<th>Roster</th>
						<th>Status</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{teams.length === 0 ? (
						<tr>
							<td colSpan={5} className="py-8 text-center text-white/40">
								No teams yet.
							</td>
						</tr>
					) : (
						teams.map((team) => {
							const nonCaptainParticipants = getNonCaptainParticipants(team);
							const isThisTeamPending = pendingTeamId === team.id;
							return (
								<tr key={team.id}>
									<td>
										<div className={"flex items-center gap-2"}>
											<div className="avatar">
												<div className="mask mask-squircle h-12 w-12">
													<Image
														src={
															team.logoUrl && team.logoUrl.startsWith("/api/teams/")
																? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}${team.logoUrl}`
																: team.logoUrl || "/aim_logo.svg"
														}
														alt="Team logo"
														width={48}
														height={48}
														unoptimized={team.logoUrl?.startsWith("/api/teams/")}
													/>
												</div>
											</div>
											{team.name}
										</div>
									</td>
									<td>
										<div className={"flex items-center gap-2"}>
											<div className="avatar">
												<div className="mask mask-squircle h-5 w-5">
													<Image
														src={`https://a.ppy.sh/${team.captain.user.osuId}`}
														alt={team.captain.user.username}
														width={20}
														height={20}
													/>
												</div>
											</div>
											{team.captain.user.username}
										</div>
									</td>
									<td>
										{isCompact && nonCaptainParticipants.length > 0 ? (
											<AvatarGroup participants={nonCaptainParticipants} max={4} />
										) : (
											<div className={"flex flex-col gap-1"}>
												{team.participants.map((participant) => (
													<div key={participant.id} className={"flex items-center gap-2"}>
														<div className="avatar">
															<div className="mask mask-squircle h-5 w-5">
																<Image
																	src={`https://a.ppy.sh/${participant.user.osuId}`}
																	alt={participant.user.username}
																	width={20}
																	height={20}
																/>
															</div>
														</div>
														<span>{participant.user.username}</span>
														{participant.pricePaid != null && (
															<span className="badge badge-outline badge-sm text-xs">
																{participant.pricePaid.toLocaleString("en-US")} pts
															</span>
														)}
													</div>
												))}
											</div>
										)}
									</td>
									<td>{team.status}</td>
									<td>
										<div className="flex flex-wrap gap-2">
											{canChangeTeamStatus && (
												<>
													<button
														className="btn btn-ghost btn-xs gap-1"
														onClick={() => handleChangeTeamStatus(team.id, "ACCEPTED")}
														disabled={isThisTeamPending}
													>
														{isThisTeamPending && <Spinner />}
														ACCEPT
													</button>
													<button
														className="btn btn-ghost btn-xs gap-1"
														onClick={() => handleChangeTeamStatus(team.id, "REJECTED")}
														disabled={isThisTeamPending}
													>
														{isThisTeamPending && <Spinner />}
														REJECT
													</button>
												</>
											)}
											{canUpdateTeam && (
												<EditTeamModal tournamentAbb={tournamentAbbreviation} team={team} />
											)}
											{canDeleteTeam && (
												<DeleteTeamModal
													tournamentAbb={tournamentAbbreviation}
													teamId={team.id}
													teamName={team.name}
												/>
											)}
										</div>
									</td>
								</tr>
							);
						})
					)}
				</tbody>
			</table>
		</div>
	);
};
