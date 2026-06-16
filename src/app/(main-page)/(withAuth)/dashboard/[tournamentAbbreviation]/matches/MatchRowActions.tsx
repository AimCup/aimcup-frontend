"use client";

import React, { useTransition } from "react";
import { toast } from "sonner";
import {
	signInOutMatchAction,
	deleteMatchAction,
} from "@/actions/admin/adminDeleteMatchActions";

function Spinner() {
	return <span className="loading loading-spinner loading-xs" />;
}

export function StaffSignButton({
	tournamentAbbreviation,
	matchId,
	signIn,
	type,
}: {
	tournamentAbbreviation: string;
	matchId: string;
	signIn: boolean;
	type: "REFEREE" | "COMMENTATOR" | "STREAMER";
}) {
	const [isPending, startTransition] = useTransition();

	const handle = () => {
		startTransition(async () => {
			const result = await signInOutMatchAction(
				tournamentAbbreviation,
				matchId,
				signIn,
				type,
			);
			if (result.status) {
				const roleLabel = type.charAt(0) + type.slice(1).toLowerCase();
				toast.success(
					signIn
						? `Signed in as ${roleLabel}.`
						: `Signed out as ${roleLabel}.`,
					{ duration: 2500 },
				);
			} else {
				toast.error(result.errorMessage ?? "Something went wrong.", { duration: 4000 });
			}
		});
	};

	return (
		<button
			className="btn btn-ghost btn-xs mt-1 gap-1"
			onClick={handle}
			disabled={isPending}
		>
			{isPending && <Spinner />}
			{signIn ? "sign in" : "sign out"}
		</button>
	);
}

export function DeleteMatchButton({
	tournamentAbbreviation,
	matchId,
	matchLabel,
}: {
	tournamentAbbreviation: string;
	matchId: string;
	matchLabel: string;
}) {
	const [isPending, startTransition] = useTransition();

	const handle = () => {
		if (!confirm(`Delete match "${matchLabel}"? This cannot be undone.`)) {
			return;
		}
		startTransition(async () => {
			const result = await deleteMatchAction(tournamentAbbreviation, matchId);
			if (result.status) {
				toast.success(`Match "${matchLabel}" deleted.`, { duration: 2500 });
			} else {
				toast.error(result.errorMessage ?? "Failed to delete match.", { duration: 4000 });
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
			Delete
		</button>
	);
}
