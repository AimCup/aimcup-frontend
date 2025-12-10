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
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	// Filter out captain from participants for compact view
	const getNonCaptainParticipants = (team: TeamResponseDto): ParticipantResponseDto[] => {
		return team.participants.filter(
			(participant) => participant.id !== team.captain.id,
		);
	};

	const handleChangeTeamStatus = async (teamId: string, status: "ACCEPTED" | "REJECTED") => {
		startTransition(async () => {
			const result = await changeTeamStatusAction(tournamentAbbreviation, teamId, status);
			if (result.status) {
				toast.success(`Team status changed to ${status}`, {
					duration: 3000,
				});
				router.refresh();
			} else {
				const errorMsg: string = result.errorMessage || "Failed to change team status";
				toast.error(errorMsg, {
					duration: 3000,
				});
			}
		});
	};

	return (
		<div className={"flex w-full flex-col !px-3 !py-2"}>
			<div className="mb-3 flex items-center justify-between">
				<h2 className={"text-3xl font-bold leading-relaxed"}>Teams</h2>
				<label className="flex cursor-pointer items-center gap-2">
					<span className="label-text">Compact</span>
					<input
						type="checkbox"
						className="toggle toggle-primary"
						checked={isCompact}
						onChange={(e) => setIsCompact(e.target.checked)}
					/>
				</label>
			</div>
			<div className="mt-10 overflow-x-auto">
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
						{teams.map((team) => {
							const nonCaptainParticipants = getNonCaptainParticipants(team);
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
											<AvatarGroup
												participants={nonCaptainParticipants}
												max={4}
											/>
										) : (
											<div className={"flex flex-col gap-2"}>
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
														{participant.user.username}
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
														className="btn btn-ghost btn-xs"
														onClick={() => handleChangeTeamStatus(team.id, "ACCEPTED")}
														disabled={isPending}
													>
														ACCEPT
													</button>
													<button
														className="btn btn-ghost btn-xs"
														onClick={() => handleChangeTeamStatus(team.id, "REJECTED")}
														disabled={isPending}
													>
														REJECT
													</button>
												</>
											)}
											{canUpdateTeam && (
												<EditTeamModal
													tournamentAbb={tournamentAbbreviation}
													team={team}
												/>
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
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
};

