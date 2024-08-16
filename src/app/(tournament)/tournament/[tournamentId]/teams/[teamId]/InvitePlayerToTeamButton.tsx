"use client";
import React from "react";
import { toast } from "sonner";
import { Input } from "@ui/atoms/Forms/Input/Input";
import { Button } from "@ui/atoms/Button/Button";
import { useTypeSafeFormState } from "@/hooks/useTypeSafeFormState";
import { inviteToTeamAction } from "@/actions/public/createTeamAction";
import { inviteToTeamSchema } from "@/formSchemas/inviteToTeamSchema";
import { resetFormValues } from "@/lib/helpers";

export const InvitePlayerToTeamButton = ({
	team: { teamId, tournamentAbbreviation },
}: {
	team: {
		tournamentAbbreviation: string;
		teamId: string;
	};
}) => {
	const formRef = React.useRef<HTMLFormElement>(null);
	const [stateInviteToTeam, inviteToTeamFormAction] = useTypeSafeFormState(
		inviteToTeamSchema,
		async (data) => {
			const inviteToTeamResponse = await inviteToTeamAction(data);
			if (!inviteToTeamResponse.status) {
				return toast.error(inviteToTeamResponse.errorMessage, {
					duration: 3000,
				});
			}
			resetFormValues({
				formRef,
				resetWithoutInputNames: ["tournamentAbbreviation", "teamId"],
				schema: inviteToTeamSchema,
			});
		},
	);

	return (
		<form
			className={"flex flex-col gap-4 md:flex-row md:items-center"}
			ref={formRef}
			action={inviteToTeamFormAction}
		>
			<Input
				name={"osuId"}
				label={"Invite player"}
				placeholder={"osu ID"}
				errorMessage={stateInviteToTeam?.errors.osuId && stateInviteToTeam.errors.osuId[0]}
			/>
			<Button className={"mt-4"} type={"submit"}>
				Add
			</Button>
			<Input name={"teamId"} label={"teamId"} value={teamId} type={"hidden"} />
			<Input
				name={"tournamentAbbreviation"}
				label={"tournamentAbbreviation"}
				value={tournamentAbbreviation}
				type={"hidden"}
			/>
		</form>
	);
};
