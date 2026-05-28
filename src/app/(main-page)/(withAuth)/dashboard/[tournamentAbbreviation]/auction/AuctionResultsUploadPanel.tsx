"use client";

import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { type AuctionPreviewTeamDto } from "../../../../../../../client";
import { applyAuctionResultsAction, previewAuctionResultsAction } from "@/actions/admin/auctionActions";

export default function AuctionResultsUploadPanel({
    tournamentAbbreviation,
}: {
    tournamentAbbreviation: string;
}) {
    const router = useRouter();
    const fileRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<AuctionPreviewTeamDto[] | null>(null);
    const [isPreviewing, setIsPreviewing] = useState(false);
    const [isApplying, setIsApplying] = useState(false);

    async function handlePreview(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        setIsPreviewing(true);
        const result = await previewAuctionResultsAction(tournamentAbbreviation, formData);
        setIsPreviewing(false);
        if (!result.status) {
            toast.error(result.errorMessage, { duration: 4000 });
            return;
        }
        setPreview(result.response ?? []);
    }

    async function handleApply() {
        if (!fileRef.current?.files?.[0]) {
            toast.error("No file selected.");
            return;
        }
        const formData = new FormData();
        formData.append("file", fileRef.current.files[0]);
        setIsApplying(true);
        const result = await applyAuctionResultsAction(tournamentAbbreviation, formData);
        setIsApplying(false);
        if (!result.status) {
            toast.error(result.errorMessage, { duration: 4000 });
            return;
        }
        toast.success("Auction results applied!", { duration: 3000 });
        setPreview(null);
        if (fileRef.current) fileRef.current.value = "";
        router.refresh();
    }

    return (
        <section className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold">Import Auction Results</h2>
            <p className="text-sm text-gray-400">
                Upload a CSV where each row is one team:{" "}
                <code>captain_uid, player_uid, price, player_uid, price, ...</code> (osu! user IDs).
                The first row may be a header and will be skipped automatically.
            </p>
            <pre className="rounded bg-base-300 p-3 text-xs text-gray-300">{`# Example\n7562902,11367222,1500,26325715,1200,18665149,800\n4787150,9664935,950,9480076,700`}</pre>

            <form onSubmit={handlePreview} className="flex items-center gap-4">
                <input
                    ref={fileRef}
                    type="file"
                    name="file"
                    accept=".csv"
                    required
                    className="file-input file-input-bordered w-full max-w-xs"
                    onChange={() => setPreview(null)}
                />
                <button type="submit" className="btn btn-secondary" disabled={isPreviewing}>
                    {isPreviewing ? <span className="loading loading-spinner loading-sm" /> : "Preview"}
                </button>
            </form>

            {preview !== null && (
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold">Preview ({preview.length} teams)</h3>
                    {preview.length === 0 ? (
                        <p className="text-gray-400">No teams found in CSV.</p>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {preview.map((team) => (
                                <div key={team.captainParticipantId} className="rounded-lg border border-base-300 p-4">
                                    <p className="mb-2 font-bold">{team.captainUsername} (captain)</p>
                                    <table className="table table-sm w-full">
                                        <thead>
                                            <tr>
                                                <th>Username</th>
                                                <th>osu! ID</th>
                                                <th>Price Paid</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {team.players.map((p) => (
                                                <tr key={p.participantId}>
                                                    <td>{p.username}</td>
                                                    <td>{p.osuId}</td>
                                                    <td>{p.pricePaid}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center gap-4">
                        <button
                            className="btn btn-primary"
                            onClick={handleApply}
                            disabled={isApplying || preview.length === 0}
                        >
                            {isApplying ? <span className="loading loading-spinner loading-sm" /> : "Confirm & Apply"}
                        </button>
                        <button
                            className="btn btn-ghost"
                            onClick={() => setPreview(null)}
                            disabled={isApplying}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}
