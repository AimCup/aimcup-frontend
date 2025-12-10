"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteParticipantFromTeamAction } from "@/actions/public/deleteParticipantFromTeamAction";

interface DeleteParticipantButtonProps {
	tournamentId: string;
	teamId: string;
	participantId: string;
	isRegistrationStage: boolean;
}

export const DeleteParticipantButton = ({
	tournamentId,
	teamId,
	participantId,
	isRegistrationStage,
}: DeleteParticipantButtonProps) => {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const handleDelete = () => {
		if (!isRegistrationStage) {
			toast.error("You can only delete participants during the registration stage.", {
				duration: 3000,
			});
			return;
		}

		startTransition(async () => {
			const result = await deleteParticipantFromTeamAction(
				tournamentId,
				teamId,
				participantId,
			);
			if (result.status) {
				toast.success("Participant removed successfully", {
					duration: 3000,
				});
				router.refresh();
			} else {
				toast.error(result.errorMessage || "Failed to remove participant", {
					duration: 3000,
				});
			}
		});
	};

	return (
		<button
			className={"btn btn-ghost btn-xs"}
			type={"button"}
			onClick={handleDelete}
			disabled={isPending || !isRegistrationStage}
		>
			{isPending ? "Deleting..." : "delete"}
		</button>
	);
};

