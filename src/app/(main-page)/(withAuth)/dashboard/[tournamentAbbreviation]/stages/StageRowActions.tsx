"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { type stageType } from "../../../../../../../client";
import { deleteStageAction } from "@/actions/admin/adminStageActions";

function Spinner() {
	return <span className="loading loading-spinner loading-xs" />;
}

export function DeleteStageButton({
	tournamentAbbreviation,
	stageTypeValue,
	stageLabel,
}: {
	tournamentAbbreviation: string;
	stageTypeValue: stageType;
	stageLabel: string;
}) {
	const [isPending, startTransition] = useTransition();

	const handle = () => {
		if (!confirm(`Delete stage "${stageLabel}"? This cannot be undone.`)) {
			return;
		}
		startTransition(async () => {
			const result = await deleteStageAction(tournamentAbbreviation, stageTypeValue);
			if (result.status) {
				toast.success(`Stage "${stageLabel}" deleted.`, { duration: 2500 });
			} else {
				toast.error(result.errorMessage ?? "Failed to delete stage.", { duration: 4000 });
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

export function ViewMappoolButton({
	tournamentAbbreviation,
	stageTypeValue,
	mappoolId,
}: {
	tournamentAbbreviation: string;
	stageTypeValue: string;
	mappoolId: string | undefined;
}) {
	return (
		<Link
			href={`/dashboard/${tournamentAbbreviation}/mappool/${stageTypeValue}/${mappoolId}`}
			className="btn btn-ghost btn-xs"
		>
			View mappool
		</Link>
	);
}
