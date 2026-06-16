"use client";

import React, { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { type ParticipantResponseDto, type TeamResponseDto } from "../../../../../../../client";
import { designateCaptainAction, removeCaptainAction, removeParticipantAction } from "@/actions/admin/auctionActions";
import { Card } from "@ui/atoms/Card/Card";

function Spinner() {
	return <span className="loading loading-spinner loading-xs" />;
}

function MakeCaptainButton({
	tournamentAbbreviation,
	participantId,
}: {
	tournamentAbbreviation: string;
	participantId: string;
}) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const handle = () => {
		startTransition(async () => {
			const result = await designateCaptainAction(tournamentAbbreviation, participantId);
			if (result.status) {
				toast.success("Captain designated!", { duration: 2500 });
				router.refresh();
			} else {
				toast.error(result.errorMessage, { duration: 4000 });
			}
		});
	};

	return (
		<button
			className="btn btn-ghost btn-xs gap-1 text-mintGreen"
			onClick={handle}
			disabled={isPending}
		>
			{isPending && <Spinner />}
			Make Captain
		</button>
	);
}

function RemoveCaptainButton({
	tournamentAbbreviation,
	participantId,
	disabled: isDisabled,
	title,
}: {
	tournamentAbbreviation: string;
	participantId: string;
	disabled?: boolean;
	title?: string;
}) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const handle = () => {
		startTransition(async () => {
			const result = await removeCaptainAction(tournamentAbbreviation, participantId);
			if (result.status) {
				toast.success("Captain removed.", { duration: 2500 });
				router.refresh();
			} else {
				toast.error(result.errorMessage, { duration: 4000 });
			}
		});
	};

	return (
		<button
			className="btn btn-ghost btn-xs gap-1 text-flatRed"
			onClick={handle}
			disabled={isPending || isDisabled}
			title={title}
		>
			{isPending && <Spinner />}
			Remove
		</button>
	);
}

function UnregisterButton({
	tournamentAbbreviation,
	osuId,
	username,
}: {
	tournamentAbbreviation: string;
	osuId: string;
	username: string;
}) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const handle = () => {
		if (!confirm(`Unregister ${username} from this tournament?`)) return;
		startTransition(async () => {
			const result = await removeParticipantAction(tournamentAbbreviation, osuId);
			if (result.status) {
				toast.success(`${username} unregistered.`, { duration: 2500 });
				router.refresh();
			} else {
				toast.error(result.errorMessage, { duration: 4000 });
			}
		});
	};

	return (
		<button
			className="btn btn-ghost btn-xs gap-1 text-flatRed"
			onClick={handle}
			disabled={isPending}
		>
			{isPending && <Spinner />}
			Unregister
		</button>
	);
}

export default function CaptainDesignationPanel({
	participants,
	captainTeams,
	tournamentAbbreviation,
}: {
	participants: ParticipantResponseDto[];
	captainTeams: TeamResponseDto[];
	tournamentAbbreviation: string;
}) {
	const captainParticipantIds = new Set(captainTeams.map((t) => t.captain.id));

	return (
		<div className="flex flex-col gap-6">
			<Card title="Current Captains">
				<div className="overflow-x-auto">
					<table className="table">
						<thead>
							<tr>
								<th>Username</th>
								<th>Team Name</th>
								<th>Team Size</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{captainTeams.length === 0 ? (
								<tr>
									<td colSpan={4} className="py-8 text-center text-white/40">
										No captains designated yet.
									</td>
								</tr>
							) : (
								captainTeams.map((team) => (
									<tr key={team.id}>
										<td>{team.captain.user.username}</td>
										<td>{team.name}</td>
										<td>{team.participants.length}</td>
										<td>
											<RemoveCaptainButton
												tournamentAbbreviation={tournamentAbbreviation}
												participantId={team.captain.id}
												disabled={team.participants.length > 1}
												title={
													team.participants.length > 1
														? "Remove players first"
														: "Remove captain"
												}
											/>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</Card>

			<Card title="Participants">
				<div className="overflow-x-auto">
					<table className="table">
						<thead>
							<tr>
								<th>Username</th>
								<th>Rank</th>
								<th>Wants Captain</th>
								<th>Status</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{participants.length === 0 ? (
								<tr>
									<td colSpan={5} className="py-8 text-center text-white/40">
										No participants registered yet.
									</td>
								</tr>
							) : (
								participants.map((p) => {
									const isCaptain = captainParticipantIds.has(p.id);
									return (
										<tr key={p.id}>
											<td>{p.user.username}</td>
											<td>
												{p.user.globalRank
													? `#${p.user.globalRank.toLocaleString("en-US")}`
													: "—"}
											</td>
											<td>
												{p.wantsToBeCaptain ? (
													<span className="badge badge-success">Yes</span>
												) : (
													<span className="badge badge-ghost">No</span>
												)}
											</td>
											<td>
												{isCaptain ? (
													<span className="badge badge-primary">Captain</span>
												) : (
													<span className="badge badge-ghost">Player</span>
												)}
											</td>
											<td>
												<div className="flex items-center gap-1">
													{!isCaptain && (
														<MakeCaptainButton
															tournamentAbbreviation={tournamentAbbreviation}
															participantId={p.id}
														/>
													)}
													<UnregisterButton
														tournamentAbbreviation={tournamentAbbreviation}
														osuId={String(p.user.osuId)}
														username={p.user.username}
													/>
												</div>
											</td>
										</tr>
									);
								})
							)}
						</tbody>
					</table>
				</div>
			</Card>
		</div>
	);
}
