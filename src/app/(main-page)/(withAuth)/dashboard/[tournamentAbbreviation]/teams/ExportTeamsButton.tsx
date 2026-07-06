"use client";

import React, { useTransition } from "react";
import { toast } from "sonner";
import { FiUpload } from "react-icons/fi";
import { exportTeamsAction } from "@/actions/admin/adminTeamActions";
import { Button } from "@ui/atoms/Button/Button";

export default function ExportTeamsButton({
	tournamentAbbreviation,
}: {
	tournamentAbbreviation: string;
}) {
	const [isPending, startTransition] = useTransition();

	const handleExport = () => {
		startTransition(async () => {
			const result = await exportTeamsAction(tournamentAbbreviation);
			if (result.status) {
				toast.success(result.response?.message ?? "Export started.", { duration: 4000 });
			} else {
				toast.error(result.errorMessage, { duration: 4000 });
			}
		});
	};

	return (
		<Button onClick={handleExport} loading={isPending} className="gap-2 bg-mintGreen text-deepCharcoal">
			<FiUpload />
			Export now
		</Button>
	);
}
