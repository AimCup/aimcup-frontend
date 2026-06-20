"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { updateQualificationSignInLockAction } from "@/actions/admin/adminQualificationRoomsActions";
import { Button } from "@ui/atoms/Button/Button";
import { Card } from "@ui/atoms/Card/Card";

export default function SignInLockSetting({
	tournamentAbbreviation,
	currentHours,
}: {
	tournamentAbbreviation: string;
	currentHours: number;
}) {
	const [hours, setHours] = useState<string>(String(currentHours ?? 1));
	const [isSaving, setIsSaving] = useState(false);

	async function handleSave() {
		const parsed = Number(hours);
		if (!Number.isInteger(parsed) || parsed < 0) {
			toast.error("Enter a whole number of hours (0 or more).", { duration: 4000 });
			return;
		}
		setIsSaving(true);
		const result = await updateQualificationSignInLockAction(tournamentAbbreviation, parsed);
		setIsSaving(false);
		if (result.status) {
			toast.success("Sign-in lock updated.", { duration: 2500 });
		} else {
			toast.error(result.errorMessage, { duration: 4000 });
		}
	}

	return (
		<Card title="Sign-in lock">
			<p className="mb-3 text-sm text-white/50">
				How many hours before a room starts captains/players can no longer sign in.
			</p>
			<div className="flex flex-wrap items-end gap-3">
				<label className="flex flex-col gap-1">
					<span className="text-xs uppercase tracking-wide text-white/40">Hours before start</span>
					<input
						type="number"
						min={0}
						step={1}
						value={hours}
						onChange={(e) => setHours(e.target.value)}
						className="w-32 rounded-lg border border-white/10 bg-deepCharcoal px-3 py-2 outline-none focus:border-mintGreen"
					/>
				</label>
				<Button onClick={handleSave} loading={isSaving}>
					Save
				</Button>
			</div>
		</Card>
	);
}
