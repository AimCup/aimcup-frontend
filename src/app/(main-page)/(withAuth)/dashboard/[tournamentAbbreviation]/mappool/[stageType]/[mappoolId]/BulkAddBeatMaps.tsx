"use client";

import React, { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { type stageType } from "../../../../../../../../../client";
import { Button } from "@ui/atoms/Button/Button";
import Modal from "@ui/organisms/Modal/Modal";
import { parseMappoolPaste } from "@/lib/parseMappoolPaste";
import { bulkAddBeatMapsAction } from "@/actions/admin/adminBeatMapActions";

const placeholder = `NM1\t5755404
NM2\t5234607
NM3\t3667875
TB1\t5543469`;

interface IBulkAddBeatMapsProps {
	tournamentAbb: string;
	mappoolId: string;
	stageType: stageType;
}

export const BulkAddBeatMaps = ({ tournamentAbb, mappoolId, stageType }: IBulkAddBeatMapsProps) => {
	const modalRef = useRef<HTMLDialogElement>(null);
	const [paste, setPaste] = useState("");
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const { entries, errors } = useMemo(() => parseMappoolPaste(paste), [paste]);
	const hasPaste = paste.trim() !== "";
	const canSubmit = hasPaste && errors.length === 0 && entries.length > 0;

	const handleOpenModal = () => {
		setPaste("");
		modalRef.current?.showModal();
	};

	const handleSubmit = () => {
		if (!canSubmit) return;

		startTransition(async () => {
			const result = await bulkAddBeatMapsAction(
				tournamentAbb,
				mappoolId,
				stageType,
				entries.map((entry) => ({
					url: entry.beatmapId,
					modification: entry.modification,
					position: entry.position,
				})),
			);

			if (!result.status) {
				toast.error(result.errorMessage, { duration: 5000 });
				return;
			}

			toast.success(
				`Added ${result.addedCount} beatmap${result.addedCount === 1 ? "" : "s"}.`,
				{ duration: 3000 },
			);
			setPaste("");
			modalRef.current?.close();
			router.refresh();
		});
	};

	return (
		<>
			<Button onClick={handleOpenModal} type={"button"} className="bg-transparent border border-white/20">
				Bulk add
			</Button>

			<Modal ref={modalRef}>
				<h1>Bulk add beatmaps</h1>
				<p className="mt-2 text-sm text-white/60">
					Paste one map per line as a slot and a beatmap id, e.g.{" "}
					<code className="rounded bg-white/10 px-1">NM1 5755404</code>. Full beatmap urls
					work too. Maps are imported plain — mark customs and original songs from the table
					afterwards.
				</p>

				<div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
					<textarea
						className="textarea textarea-bordered h-72 w-full font-mono text-sm"
						placeholder={placeholder}
						value={paste}
						onChange={(event) => setPaste(event.target.value)}
						spellCheck={false}
					/>

					<div className="h-72 overflow-y-auto rounded-lg border border-white/10 p-3">
						{!hasPaste ? (
							<p className="text-sm text-white/40">
								Parsed maps will show up here before anything is added.
							</p>
						) : (
							<>
								{errors.length > 0 && (
									<div className="mb-3">
										<p className="mb-1 text-sm font-semibold text-flatRed">
											Fix {errors.length} line
											{errors.length === 1 ? "" : "s"} before importing —
											nothing is added until the whole paste is valid.
										</p>
										<ul className="flex flex-col gap-1">
											{errors.map((error) => (
												<li
													key={error.lineNumber}
													className="text-xs text-flatRed"
												>
													Line {error.lineNumber}: {error.message}
												</li>
											))}
										</ul>
									</div>
								)}

								{entries.length > 0 && (
									<>
										<p className="mb-1 text-sm font-semibold text-white/70">
											{entries.length} map
											{entries.length === 1 ? "" : "s"} ready
										</p>
										<ul className="flex flex-col gap-1">
											{entries.map((entry) => (
												<li
													key={entry.lineNumber}
													className="flex gap-2 font-mono text-xs text-white/60"
												>
													<span className="badge badge-ghost badge-sm">
														{entry.slot}
													</span>
													<span>{entry.beatmapId}</span>
												</li>
											))}
										</ul>
									</>
								)}
							</>
						)}
					</div>
				</div>

				<div className="mt-4 flex gap-2">
					<Button onClick={handleSubmit} disabled={!canSubmit} loading={isPending}>
						{isPending
							? "Adding…"
							: `Add ${entries.length || ""} beatmap${entries.length === 1 ? "" : "s"}`}
					</Button>
					<Button
						onClick={() => modalRef.current?.close()}
						className="bg-transparent border border-white/20"
					>
						Cancel
					</Button>
				</div>
			</Modal>
		</>
	);
};
