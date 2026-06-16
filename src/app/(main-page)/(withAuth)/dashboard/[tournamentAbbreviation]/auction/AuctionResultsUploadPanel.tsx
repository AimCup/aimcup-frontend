"use client";

import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FiUpload } from "react-icons/fi";
import { type AuctionPreviewTeamDto } from "../../../../../../../client";
import { applyAuctionResultsAction, previewAuctionResultsAction } from "@/actions/admin/auctionActions";
import { Card } from "@ui/atoms/Card/Card";

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
		toast.success("CSV parsed successfully — review the preview below.", { duration: 2500 });
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
		<Card title="Import Auction Results">
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-2">
					<p className="text-sm text-white/50">
						Upload a CSV where each row is one team:{" "}
						<code className="rounded bg-white/10 px-1 py-0.5 text-xs text-white/80">
							captain_uid, player_uid, price, player_uid, price, ...
						</code>{" "}
						(osu! user IDs). The first row may be a header and will be skipped automatically.
					</p>
					<pre className="rounded-lg border border-white/5 bg-deepCharcoal p-3 text-xs text-white/60">{`# Example\n7562902,11367222,1500,26325715,1200,18665149,800\n4787150,9664935,950,9480076,700`}</pre>
				</div>

				<form onSubmit={handlePreview} className="flex flex-wrap items-center gap-4">
					<input
						ref={fileRef}
						type="file"
						name="file"
						accept=".csv"
						required
						className="file-input file-input-bordered w-full max-w-xs"
						onChange={() => setPreview(null)}
					/>
					<button
						type="submit"
						className="btn btn-secondary gap-2"
						disabled={isPreviewing}
					>
						{isPreviewing ? (
							<span className="loading loading-spinner loading-sm" />
						) : (
							<FiUpload className="h-4 w-4" />
						)}
						{isPreviewing ? "Parsing…" : "Preview"}
					</button>
				</form>

				{preview !== null && (
					<div className="flex flex-col gap-4">
						<h3 className="text-base font-semibold text-white">
							Preview — {preview.length} team{preview.length !== 1 ? "s" : ""}
						</h3>
						{preview.length === 0 ? (
							<p className="text-sm text-white/40">No teams found in CSV.</p>
						) : (
							<div className="flex flex-col gap-4">
								{preview.map((team) => (
									<div
										key={team.captainParticipantId}
										className="rounded-xl border border-white/5 bg-deepCharcoal p-4"
									>
										<p className="mb-3 font-semibold text-white">
											{team.captainUsername}{" "}
											<span className="text-sm font-normal text-white/40">(captain)</span>
										</p>
										<table className="table table-sm">
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

						<div className="flex items-center gap-3 pt-2">
							<button
								className="btn btn-primary gap-2"
								onClick={handleApply}
								disabled={isApplying || preview.length === 0}
							>
								{isApplying && <span className="loading loading-spinner loading-sm" />}
								{isApplying ? "Applying…" : "Confirm & Apply"}
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
			</div>
		</Card>
	);
}
