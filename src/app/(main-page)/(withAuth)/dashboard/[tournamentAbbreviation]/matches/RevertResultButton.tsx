"use client";

import React, { useTransition } from "react";
import { toast } from "sonner";
import { revertMatchResultAction } from "@/actions/admin/adminMatchResultActions";

export function RevertResultButton({
	tournamentAbbreviation,
	matchId,
}: {
	tournamentAbbreviation: string;
	matchId: string;
}) {
	const [isPending, startTransition] = useTransition();

	const handle = () => {
		if (!window.confirm("Revert this match result? The match will move back to Upcoming matches.")) {
			return;
		}
		startTransition(async () => {
			const result = await revertMatchResultAction(tournamentAbbreviation, matchId);
			if (result.status) {
				toast.success("Result reverted.", { duration: 3000 });
			} else {
				toast.error(result.errorMessage ?? "Failed to revert result.", { duration: 4000 });
			}
		});
	};

	return (
		<button
			className="btn btn-ghost btn-xs gap-1 text-flatRed"
			onClick={handle}
			disabled={isPending}
			type="button"
		>
			{isPending && <span className="loading loading-spinner loading-xs" />}
			Revert result
		</button>
	);
}
