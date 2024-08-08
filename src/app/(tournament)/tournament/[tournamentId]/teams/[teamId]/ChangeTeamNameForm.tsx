"use client";
import React from "react";
import { toast } from "sonner";
import { Input } from "@ui/atoms/Forms/Input/Input";
import { Button } from "@ui/atoms/Button/Button";
import { useTypeSafeFormState } from "@/hooks/useTypeSafeFormState";
import { updateTeamSchema } from "@/formSchemas/updateTeamSchema";
import { updateTeam } from "@/actions/public/createTeamAction";

export const ChangeTeamNameForm = ({
	team: { teamId, teamName, logoUrl, tournamentAbbreviation },
}: {
	team: {
		tournamentAbbreviation: string;
		teamId: string;
		teamName: string;
		logoUrl: string;
	};
}) => {
	const [stateChangeTeamProperties, changeTeamPropertiesFormAction] = useTypeSafeFormState(
		updateTeamSchema,
		async (data) => {
			const updateTeamResponse = await updateTeam(data);
			if (!updateTeamResponse.status) {
				return toast.error(updateTeamResponse.errorMessage, {
					duration: 3000,
				});
			}
		},
	);

	return (
		<form
			className={"flex flex-col gap-4 md:flex-row md:items-center"}
			action={changeTeamPropertiesFormAction}
		>
			<Input
				name={"name"}
				label={"Team name"}
				placeholder={"team name"}
				errorMessage={
					stateChangeTeamProperties?.errors.name &&
					stateChangeTeamProperties.errors?.name[0]
				}
				defaultValue={teamName}
				required={true}
			/>
			<Input
				name={"logoUrl"}
				label={"Logo URL"}
				defaultValue={logoUrl}
				placeholder={"logo url"}
				errorMessage={
					stateChangeTeamProperties?.errors.logoUrl &&
					stateChangeTeamProperties.errors?.logoUrl[0]
				}
				required={true}
			/>
			<Button className={"mt-4"} type={"submit"}>
				Update
			</Button>
			<Input name={"teamId"} label={"teamId"} value={teamId} type={"hidden"} />
			<Input
				type={"hidden"}
				name={"tournamentAbbreviation"}
				label={"tournamentAbbreviation"}
				value={tournamentAbbreviation}
			/>
		</form>
	);
};
