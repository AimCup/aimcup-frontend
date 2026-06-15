"use client";

import React, { useTransition } from "react";
import { toast } from "sonner";
import {
	deleteQualificationRoomAction,
	signInOutQualificationRoomAction,
} from "@/actions/admin/adminQualificationRoomsActions";

function Spinner() {
	return <span className="loading loading-spinner loading-xs" />;
}

export function RefereeSignButton({
	tournamentAbbreviation,
	roomId,
	signIn,
}: {
	tournamentAbbreviation: string;
	roomId: string;
	signIn: boolean;
}) {
	const [isPending, startTransition] = useTransition();

	const handle = () => {
		startTransition(async () => {
			const result = await signInOutQualificationRoomAction(tournamentAbbreviation, roomId, signIn);
			if (result.status) {
				toast.success(signIn ? "Signed in to the room." : "Signed out of the room.", { duration: 2500 });
			} else {
				toast.error(result.errorMessage, { duration: 4000 });
			}
		});
	};

	return (
		<button className="btn btn-ghost btn-xs gap-1" onClick={handle} disabled={isPending}>
			{isPending && <Spinner />}
			{signIn ? "sign in" : "sign out"}
		</button>
	);
}

export function DeleteRoomButton({
	tournamentAbbreviation,
	roomId,
	roomNumber,
}: {
	tournamentAbbreviation: string;
	roomId: string;
	roomNumber: number;
}) {
	const [isPending, startTransition] = useTransition();

	const handle = () => {
		if (!confirm(`Delete qualification room #${roomNumber}? This cannot be undone.`)) {
			return;
		}
		startTransition(async () => {
			const result = await deleteQualificationRoomAction(tournamentAbbreviation, roomId);
			if (result.status) {
				toast.success(`Room #${roomNumber} deleted.`, { duration: 2500 });
			} else {
				toast.error(result.errorMessage, { duration: 4000 });
			}
		});
	};

	return (
		<button className="btn btn-ghost btn-xs gap-1 text-flatRed" onClick={handle} disabled={isPending}>
			{isPending && <Spinner />}
			delete
		</button>
	);
}
