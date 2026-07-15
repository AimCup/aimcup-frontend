"use client";

import React, { useTransition } from "react";
import { toast } from "sonner";
import { type modification, type stageType } from "../../../../../../../../../client";
import {
	deleteBeatmapAction,
	releaseMappoolAction,
	toggleCustomMapAction,
	toggleOriginalSongAction,
} from "@/actions/admin/adminMappoolActions";
import { Button } from "@ui/atoms/Button/Button";

function Spinner() {
	return <span className="loading loading-spinner loading-xs" />;
}

// ---------------------------------------------------------------------------
// Release / Unrelease mappool
// ---------------------------------------------------------------------------

export function ReleaseMappoolButton({
	tournamentAbbreviation,
	stageType,
	mappoolId,
	isReleased,
}: {
	tournamentAbbreviation: string;
	stageType: stageType;
	mappoolId: string;
	isReleased: boolean;
}) {
	const [isPending, startTransition] = useTransition();

	const handle = () => {
		startTransition(async () => {
			const result = await releaseMappoolAction(
				tournamentAbbreviation,
				stageType,
				mappoolId,
				!isReleased,
			);
			if (result.status) {
				toast.success(isReleased ? "Mappool unreleased." : "Mappool released.", {
					duration: 2500,
				});
			} else {
				toast.error(result.errorMessage, { duration: 4000 });
			}
		});
	};

	return (
		<Button loading={isPending} onClick={handle}>
			{isReleased ? "Unrelease" : "Release"} mappool
		</Button>
	);
}

// ---------------------------------------------------------------------------
// Toggle "original song" flag
// ---------------------------------------------------------------------------

export function ToggleOriginalSongButton({
	tournamentAbbreviation,
	stageType,
	mappoolId,
	beatmapId,
	isCustomSong,
}: {
	tournamentAbbreviation: string;
	stageType: stageType;
	mappoolId: string;
	beatmapId: string;
	isCustomSong: boolean;
}) {
	const [isPending, startTransition] = useTransition();

	const handle = () => {
		startTransition(async () => {
			const result = await toggleOriginalSongAction(
				tournamentAbbreviation,
				stageType,
				mappoolId,
				beatmapId,
				!isCustomSong,
			);
			if (result.status) {
				toast.success(
					isCustomSong ? "Removed original song mark." : "Marked as original song.",
					{ duration: 2500 },
				);
			} else {
				toast.error(result.errorMessage, { duration: 4000 });
			}
		});
	};

	return (
		<button
			className={`btn btn-xs ${isCustomSong ? "btn-success" : "btn-ghost"}`}
			onClick={handle}
			disabled={isPending}
		>
			{isPending && <Spinner />}
			{isCustomSong ? "Original ✓" : "Mark"}
		</button>
	);
}

// ---------------------------------------------------------------------------
// Toggle "custom map" flag
// ---------------------------------------------------------------------------

export function ToggleCustomMapButton({
	tournamentAbbreviation,
	stageType,
	mappoolId,
	beatmapId,
	isCustom,
}: {
	tournamentAbbreviation: string;
	stageType: stageType;
	mappoolId: string;
	beatmapId: string;
	isCustom: boolean;
}) {
	const [isPending, startTransition] = useTransition();

	const handle = () => {
		startTransition(async () => {
			const result = await toggleCustomMapAction(
				tournamentAbbreviation,
				stageType,
				mappoolId,
				beatmapId,
				!isCustom,
			);
			if (result.status) {
				toast.success(isCustom ? "Removed custom map mark." : "Marked as custom map.", {
					duration: 2500,
				});
			} else {
				toast.error(result.errorMessage, { duration: 4000 });
			}
		});
	};

	return (
		<button
			className={`btn btn-xs ${isCustom ? "btn-success" : "btn-ghost"}`}
			onClick={handle}
			disabled={isPending}
		>
			{isPending && <Spinner />}
			{isCustom ? "Custom ✓" : "Mark"}
		</button>
	);
}

// ---------------------------------------------------------------------------
// Delete beatmap
// ---------------------------------------------------------------------------

export function DeleteBeatmapButton({
	tournamentAbbreviation,
	stageType,
	mappoolId,
	beatmapModification,
	beatmapId,
	beatmapTitle,
}: {
	tournamentAbbreviation: string;
	stageType: stageType;
	mappoolId: string;
	beatmapModification: modification;
	beatmapId: string;
	beatmapTitle: string;
}) {
	const [isPending, startTransition] = useTransition();

	const handle = () => {
		if (!confirm(`Delete "${beatmapTitle}" from the mappool? This cannot be undone.`)) {
			return;
		}
		startTransition(async () => {
			const result = await deleteBeatmapAction(
				tournamentAbbreviation,
				stageType,
				mappoolId,
				beatmapModification,
				beatmapId,
			);
			if (result.status) {
				toast.success("Beatmap deleted.", { duration: 2500 });
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
			delete
		</button>
	);
}
