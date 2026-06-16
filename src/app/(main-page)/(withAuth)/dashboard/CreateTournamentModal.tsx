"use client";

import React, { useRef } from "react";
import { FiPlus } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { qualificationType, tournamentType } from "../../../../../client";
import { Button } from "@ui/atoms/Button/Button";
import { SubmitButton } from "@ui/atoms/Button/SubmitButton";
import Modal from "@ui/organisms/Modal/Modal";
import { useTypeSafeFormState } from "@/hooks/useTypeSafeFormState";
import { createTournamentSchema } from "@/formSchemas/createTournamentSchema";
import { Input } from "@ui/atoms/Forms/Input/Input";
import { ComboBox, type selectOptions } from "@ui/atoms/Forms/Select/ComboBox";
import { createTournamentAction } from "@/actions/public/createTournamentAction";

const CreateTournamentModal = () => {
	const modalRef = useRef<HTMLDialogElement>(null);

	const router = useRouter();
	const formRef = React.useRef<HTMLFormElement>(null);
	const [state, formAction] = useTypeSafeFormState(createTournamentSchema, async (data) => {
		const tournamentResponseDto = await createTournamentAction(data);
		if (!tournamentResponseDto.status) {
			return toast.error(tournamentResponseDto.errorMessage, {
				duration: 4000,
			});
		}
		toast.success(`Tournament "${tournamentResponseDto.response.name}" created.`, {
			duration: 2500,
		});
		modalRef.current?.close();
		formRef.current?.reset();
		router.push(`/dashboard/${tournamentResponseDto.response.abbreviation}`);
	});
	const [tournamentTourType, setTournamentTourType] =
		React.useState<tournamentType>(
			tournamentType.TEAM_VS,
		);

	const tournamentTourTypeSelectOptions: selectOptions[] = [
		{ id: tournamentType.TEAM_VS, label: "Team vs" },
		{ id: tournamentType.INTERNATIONAL, label: "International" },
		{ id: tournamentType.AUCTION, label: "Auction" },
	];

	const qualificationTypeSelectOptions: selectOptions[] = [
		{ id: qualificationType.Z_SUM, label: "Z-sum" },
		{ id: qualificationType.ZIP_LAW, label: "Zip law" },
	];

	return (
		<>
			<Button
				onClick={() => modalRef?.current?.showModal()}
				type="button"
				className="flex items-center gap-2"
			>
				<FiPlus size={16} />
				New tournament
			</Button>

			<Modal ref={modalRef}>
				<h1 className="mb-4 text-xl font-bold text-white">Create tournament</h1>
				<form action={formAction} ref={formRef} id="create-tournament">
					<div
						className="grid w-full max-w-5xl grid-cols-1 gap-4 rounded-lg p-4 md:grid-cols-2"
					>
						<Input
							label="Tournament name"
							name="name"
							errorMessage={state?.errors.name && state.errors.name[0]}
							required={true}
						/>
						<Input
							name="abbreviation"
							errorMessage={
								state?.errors.abbreviation && state.errors.abbreviation[0]
							}
							label="Abbreviation"
						/>
						<ComboBox
							required={true}
							name="tournamentType"
							label="Select tournament type"
							selectOptions={tournamentTourTypeSelectOptions}
							onSelect={(e) => {
								setTournamentTourType(
									e.target.value as tournamentType,
								);
							}}
						/>
						<ComboBox
							name="qualificationType"
							label="Select qualification type"
							selectOptions={qualificationTypeSelectOptions}
						/>
						<Input
							name="minimumRankLimit"
							placeholder="minimumRankLimit"
							type="number"
							errorMessage={
								state?.errors.minimumRankLimit && state.errors.minimumRankLimit[0]
							}
							label="Minimum rank limit"
						/>
						<Input
							name="maximumRankLimit"
							placeholder="maximumRankLimit"
							type="number"
							errorMessage={
								state?.errors.maximumRankLimit && state.errors.maximumRankLimit[0]
							}
							label="Maximum rank limit"
						/>
						{tournamentTourType !== tournamentType.PARTICIPANT_VS && (
							<>
								<Input
									name="minimumTeamSize"
									label="Minimum team size"
									type="number"
									errorMessage={
										state?.errors.minimumTeamSize &&
										state.errors.minimumTeamSize[0]
									}
								/>
								<Input
									name="maximumTeamSize"
									label="Maximum team size"
									errorMessage={
										state?.errors.maximumTeamSize &&
										state.errors.maximumTeamSize[0]
									}
									type="number"
								/>
							</>
						)}
					</div>
					<SubmitButton
						className="mt-4 rounded-md bg-deepRed px-6 py-2 text-white hover:opacity-80"
						pendingText="Creating…"
					>
						Create tournament
					</SubmitButton>
				</form>
			</Modal>
		</>
	);
};

export default CreateTournamentModal;
