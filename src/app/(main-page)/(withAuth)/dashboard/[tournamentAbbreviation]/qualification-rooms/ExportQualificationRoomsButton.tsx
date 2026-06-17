"use client";

import React, { useTransition } from "react";
import { toast } from "sonner";
import { FiUpload } from "react-icons/fi";
import { exportQualificationRoomsAction } from "@/actions/admin/adminQualificationRoomsActions";
import { Button } from "@ui/atoms/Button/Button";

export default function ExportQualificationRoomsButton({
	tournamentAbbreviation,
}: {
	tournamentAbbreviation: string;
}) {
	const [isPending, startTransition] = useTransition();

	const handleExport = () => {
		startTransition(async () => {
			const result = await exportQualificationRoomsAction(tournamentAbbreviation);
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
