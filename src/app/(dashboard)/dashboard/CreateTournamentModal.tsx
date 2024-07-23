"use client";

import React, { useRef } from "react";
import { IoMdAdd } from "react-icons/io";
import { TournamentRequestDto, type UserResponseDTO } from "../../../../generated";
import { Button } from "@ui/atoms/Button/Button";
import { useAppSelector } from "@/lib/redux/hooks";
import Modal from "@ui/organisms/Modal/Modal";
import { useTypeSafeFormState } from "@/hooks/useTypeSafeFormState";
import { createTournamentSchema } from "@/app/(dashboard)/dashboard/createTournamentSchema";
import { Input } from "@ui/atoms/Forms/Input/Input";
import { ComboBox, type selectOptions } from "@ui/atoms/Forms/Select/ComboBox";

type IModalProps = {};

const CreateTournamentModal = (_props: IModalProps) => {
	const modalRef = useRef<HTMLDialogElement>(null);
	const user = useAppSelector<UserResponseDTO>((state) => state.user);
	// const router = useRouter();
	const [state, formAction] = useTypeSafeFormState(createTournamentSchema, async (_data) => {
		// const tournamentResponseDto = await createTournamentAction(data);
		// if (tournamentResponseDto.status) {
		// 	router.push(`/dashboard/${tournamentResponseDto.response.abbreviation}`);
		// } else {
		// 	console.error(tournamentResponseDto.errorMessage);
		// }

		modalRef.current?.close();
		// router.push(`/dashboard/${tournamentResponseDto.}`)
	});
	const [tournamentTourType, setTournamentTourType] =
		React.useState<TournamentRequestDto.tournamentType>(
			TournamentRequestDto.tournamentType.TEAM_VS,
		);

	const tournamentTourTypeSelectOptions: selectOptions[] = [
		{ id: TournamentRequestDto.tournamentType.TEAM_VS, label: "Team vs" },
		{ id: TournamentRequestDto.tournamentType.INTERNATIONAL, label: "International" },
		{ id: TournamentRequestDto.tournamentType.PARTICIPANT_VS, label: "Participant vs" },
	];

	const qualificationTypeSelectOptions: selectOptions[] = [
		{ id: TournamentRequestDto.qualificationType.Z_SUM, label: "Z-sum" },
		{ id: TournamentRequestDto.qualificationType.ZIP_LAW, label: "Zip law" },
	];

	if (user === null) return null;
	// TODO: Change to ROLE_ADMIN
	if (!user.roles.some((role) => role.name === "ROLE_USER")) return null;

	return (
		<>
			<Button
				onClick={() => modalRef?.current?.showModal()}
				className={
					"flex h-64 items-center justify-center border-2 border-dashed bg-transparent transition-all duration-75 hover:border-4"
				}
			>
				<IoMdAdd size={64} />
			</Button>

			<Modal ref={modalRef}>
				<h1>Create tournament</h1>
				<form action={formAction}>
					<div
						className={
							"grid w-full max-w-5xl grid-cols-1 gap-4 rounded-lg p-4 md:grid-cols-2"
						}
					>
						<Input
							label={"Tournament name"}
							name={"name"}
							errorMessage={state?.errors.name && state.errors.name[0]}
							showAsterisk={true}
						/>
						<Input
							name={"abbreviation"}
							errorMessage={
								state?.errors.abbreviation && state.errors.abbreviation[0]
							}
							label={"Abbreviation"}
						/>
						<ComboBox
							label={"Select tournament type"}
							selectOptions={tournamentTourTypeSelectOptions}
							onSelect={(e) => {
								setTournamentTourType(
									e.target.value as TournamentRequestDto.tournamentType,
								);
							}}
						/>
						<ComboBox
							label={"Select qualification type"}
							selectOptions={qualificationTypeSelectOptions}
						/>
						<Input
							name={"minimumRankLimit"}
							placeholder={"minimumRankLimit"}
							type={"number"}
							errorMessage={
								state?.errors.minimumRankLimit && state.errors.minimumRankLimit[0]
							}
							label={"Minimum rank limit"}
						/>
						<Input
							name={"maximumRankLimit"}
							placeholder={"maximumRankLimit"}
							type={"number"}
							errorMessage={
								state?.errors.maximumRankLimit && state.errors.maximumRankLimit[0]
							}
							label={"Maximum rank limit"}
						/>
						{tournamentTourType !==
							TournamentRequestDto.tournamentType.PARTICIPANT_VS && (
							<>
								<Input
									name={"minimumTeamSize"}
									label={"Minimum team size"}
									type={"number"}
									errorMessage={
										state?.errors.minimumTeamSize &&
										state.errors.minimumTeamSize[0]
									}
								/>
								<Input
									name={"maximumTeamSize"}
									label={"Maximum team size"}
									errorMessage={
										state?.errors.maximumTeamSize &&
										state.errors.maximumTeamSize[0]
									}
									type={"number"}
								/>
							</>
						)}
					</div>
					<Button className="mt-4 w-max" type={"submit"}>
						Create team
					</Button>
				</form>
			</Modal>
		</>
	);
};

export default CreateTournamentModal;
