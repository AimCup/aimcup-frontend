"use client";

import React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { type ParticipantResponseDto, type TeamResponseDto } from "../../../../../../../client";
import { designateCaptainAction, removeCaptainAction, removeParticipantAction } from "@/actions/admin/auctionActions";

export default function CaptainDesignationPanel({
    participants,
    captainTeams,
    tournamentAbbreviation,
}: {
    participants: ParticipantResponseDto[];
    captainTeams: TeamResponseDto[];
    tournamentAbbreviation: string;
}) {
    const router = useRouter();
    const captainParticipantIds = new Set(captainTeams.map((t) => t.captain.id));

    async function handleDesignate(participantId: string) {
        const result = await designateCaptainAction(tournamentAbbreviation, participantId);
        if (!result.status) {
            toast.error(result.errorMessage, { duration: 3000 });
        } else {
            toast.success("Captain designated!", { duration: 2000 });
            router.refresh();
        }
    }

    async function handleRemove(participantId: string) {
        const result = await removeCaptainAction(tournamentAbbreviation, participantId);
        if (!result.status) {
            toast.error(result.errorMessage, { duration: 3000 });
        } else {
            toast.success("Captain removed.", { duration: 2000 });
            router.refresh();
        }
    }

    async function handleUnregister(osuId: string, username: string) {
        if (!confirm(`Unregister ${username} from this tournament?`)) return;
        const result = await removeParticipantAction(tournamentAbbreviation, osuId);
        if (!result.status) {
            toast.error(result.errorMessage, { duration: 3000 });
        } else {
            toast.success(`${username} unregistered.`, { duration: 2000 });
            router.refresh();
        }
    }

    return (
        <div className="flex flex-col gap-8">
            <section>
                <h2 className="mb-4 text-2xl font-bold">Current Captains</h2>
                {captainTeams.length === 0 ? (
                    <p className="text-gray-400">No captains designated yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Team Name</th>
                                    <th>Team Size</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {captainTeams.map((team) => (
                                    <tr key={team.id}>
                                        <td>{team.captain.user.username}</td>
                                        <td>{team.name}</td>
                                        <td>{team.participants.length}</td>
                                        <td>
                                            <button
                                                className="btn btn-error btn-sm"
                                                onClick={() => handleRemove(team.captain.id)}
                                                disabled={team.participants.length > 1}
                                                title={team.participants.length > 1 ? "Remove players first" : "Remove captain"}
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <section>
                <h2 className="mb-4 text-2xl font-bold">Participants</h2>
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Rank</th>
                                <th>Wants Captain</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {participants.map((p) => {
                                const isCaptain = captainParticipantIds.has(p.id);
                                return (
                                    <tr key={p.id}>
                                        <td>{p.user.username}</td>
                                        <td>
                                            {p.user.globalRank
                                                ? `#${p.user.globalRank.toLocaleString('en-US')}`
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
                                        <td className="flex gap-2">
                                            {!isCaptain && (
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => handleDesignate(p.id)}
                                                >
                                                    Make Captain
                                                </button>
                                            )}
                                            <button
                                                className="btn btn-error btn-sm"
                                                onClick={() => handleUnregister(String(p.user.osuId), p.user.username)}
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
