"use client";

import React, { useRef, useTransition } from "react";
import { toast } from "sonner";
import { setMatchResultAction } from "@/actions/admin/adminMatchResultActions";
import { Button } from "@ui/atoms/Button/Button";
import Modal from "@ui/organisms/Modal/Modal";
import { Input } from "@ui/atoms/Forms/Input/Input";

type MatchResultLike = {
	mpUrl?: string | null;
	chatLogUrl?: string | null;
	redScore?: number | null;
	blueScore?: number | null;
} | null;

type MatchLike = {
	id: string;
	teamBlue: { name: string };
	teamRed: { name: string };
	matchResult?: MatchResultLike;
};

export function MatchResultModal({
	tournamentAbbreviation,
	match,
	mode,
}: {
	tournamentAbbreviation: string;
	match: MatchLike;
	mode: "add" | "edit";
}) {
	const modalRef = useRef<HTMLDialogElement>(null);
	const formRef = useRef<HTMLFormElement>(null);
	const [isPending, startTransition] = useTransition();
	const result = match.matchResult ?? null;

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const mpUrl = String(formData.get("mpUrl") ?? "").trim();
		const chatLogUrl = String(formData.get("chatLogUrl") ?? "").trim();
		const blueScoreRaw = String(formData.get("blueScore") ?? "").trim();
		const redScoreRaw = String(formData.get("redScore") ?? "").trim();

		startTransition(async () => {
			const response = await setMatchResultAction(tournamentAbbreviation, match.id, {
				mpUrl,
				chatLogUrl: chatLogUrl || undefined,
				blueScore: blueScoreRaw === "" ? undefined : Number(blueScoreRaw),
				redScore: redScoreRaw === "" ? undefined : Number(redScoreRaw),
			});
			if (response.status) {
				toast.success("Result saved.", { duration: 3000 });
				modalRef.current?.close();
			} else {
				toast.error(response.errorMessage ?? "Failed to save result.", { duration: 4000 });
			}
		});
	};

	return (
		<>
			<button
				className="btn btn-ghost btn-xs gap-1"
				type="button"
				onClick={() => modalRef.current?.showModal()}
			>
				{mode === "add" ? "Add mp link" : "Edit mp link"}
			</button>

			<Modal ref={modalRef}>
				<h1 className="text-lg font-bold text-white">
					{mode === "add" ? "Add match result" : "Edit match result"}
				</h1>
				<form ref={formRef} onSubmit={handleSubmit}>
					<div className="grid grid-cols-1 gap-3 p-4">
						<Input label="MP link" name="mpUrl" required defaultValue={result?.mpUrl ?? ""} />
						<Input label="ChatLog link" name="chatLogUrl" defaultValue={result?.chatLogUrl ?? ""} />
						<Input
							label={`${match.teamBlue.name} score`}
							name="blueScore"
							type="number"
							required
							defaultValue={result?.blueScore != null ? String(result.blueScore) : ""}
						/>
						<Input
							label={`${match.teamRed.name} score`}
							name="redScore"
							type="number"
							required
							defaultValue={result?.redScore != null ? String(result.redScore) : ""}
						/>
					</div>
					<Button type="submit" loading={isPending} className="mt-2">
						Set result
					</Button>
				</form>
			</Modal>
		</>
	);
}
