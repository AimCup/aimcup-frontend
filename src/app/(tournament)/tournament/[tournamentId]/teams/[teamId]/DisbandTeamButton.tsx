"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@ui/atoms/Button/Button";
import { disbandTeamAction } from "@/actions/public/disbandTeamAction";

interface DisbandTeamButtonProps {
	tournamentId: string;
	teamId: string;
	isRegistrationStage: boolean;
}

export const DisbandTeamButton = ({
	tournamentId,
	teamId,
	isRegistrationStage,
}: DisbandTeamButtonProps) => {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const handleDisband = () => {
		if (!isRegistrationStage) {
			toast.error("You can only disband team during the registration stage.", {
				duration: 3000,
			});
			return;
		}

		startTransition(async () => {
			const result = await disbandTeamAction(tournamentId, teamId);
			if (result.status) {
				toast.success("Team disbanded successfully", {
					duration: 3000,
				});
				router.push(`/tournament/${tournamentId}/teams`);
			} else {
				toast.error(result.errorMessage || "Failed to disband team", {
					duration: 3000,
				});
			}
		});
	};

	return (
		<Button
			type="button"
			onClick={handleDisband}
			disabled={isPending || !isRegistrationStage}
		>
			{isPending ? "Disbanding..." : "Disband team"}
		</Button>
	);
};

