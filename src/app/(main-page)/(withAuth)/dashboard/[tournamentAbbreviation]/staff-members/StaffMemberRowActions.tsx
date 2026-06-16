"use client";

import React, { useTransition } from "react";
import { toast } from "sonner";
import { deleteStaffMemberAction } from "@/actions/admin/adminStaffMembersActions";

function Spinner() {
	return <span className="loading loading-spinner loading-xs" />;
}

export function DeleteStaffMemberButton({
	tournamentAbbreviation,
	staffMemberId,
	displayName,
}: {
	tournamentAbbreviation: string;
	staffMemberId: string;
	displayName: string;
}) {
	const [isPending, startTransition] = useTransition();

	const handle = () => {
		if (!confirm(`Delete staff member "${displayName}"? This cannot be undone.`)) {
			return;
		}
		startTransition(async () => {
			const result = await deleteStaffMemberAction(tournamentAbbreviation, staffMemberId);
			if (result.status) {
				toast.success(`Staff member "${displayName}" deleted.`, { duration: 2500 });
			} else {
				toast.error(result.errorMessage ?? "Failed to delete staff member.", { duration: 4000 });
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
