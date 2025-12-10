"use client";
import React, { useRef, useEffect } from "react";
import { toast } from "sonner";
import type { MatchResponseDto } from "../../../../../../../client";
import { Button } from "@ui/atoms/Button/Button";
import Modal from "@ui/organisms/Modal/Modal";
import { StaffMemberAutocomplete } from "@ui/atoms/Forms/Select/StaffMemberAutocomplete";
import type { selectOptions } from "@ui/atoms/Forms/Select/ComboBox";
import { Input } from "@ui/atoms/Forms/Input/Input";
import { useTypeSafeFormState } from "@/hooks/useTypeSafeFormState";
import { resetFormValues } from "@/lib/helpers";
import { editMatchSchema } from "@/formSchemas/editMatchSchema";
import { editMatchAction } from "@/actions/admin/adminEditMatchActions";

type EditMatchModalType = {
	match: MatchResponseDto;
	staffMembers: selectOptions[];
};

interface IEditMatchModalProps {
	tournamentAbb: string;
	modalType: EditMatchModalType;
}

export const EditMatchModal = ({
	tournamentAbb,
	modalType,
}: IEditMatchModalProps) => {
	const modalRef = useRef<HTMLDialogElement>(null);
	const formRef = React.useRef<HTMLFormElement>(null);

	// Format date for datetime-local input (YYYY-MM-DDTHH:mm)
	const formatDateForInput = (dateString: string | null | undefined): string => {
		if (!dateString) {
			return "";
		}
		const date = new Date(dateString);
		// Check if date is valid
		if (isNaN(date.getTime())) {
			return "";
		}
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		const hours = String(date.getHours()).padStart(2, "0");
		const minutes = String(date.getMinutes()).padStart(2, "0");
		return `${year}-${month}-${day}T${hours}:${minutes}`;
	};

	const [stateEditMatch, formActionEditMatch] = useTypeSafeFormState(
		editMatchSchema,
		async (data) => {
			const editMatchResponse = await editMatchAction(data);
			if (!editMatchResponse.status) {
				return toast.error(editMatchResponse.errorMessage, {
					duration: 3000,
				});
			}
			toast.success("Match updated successfully", {
				duration: 3000,
			});
			modalRef.current?.close();
			resetFormValues({
				formRef,
				resetWithoutInputNames: ["tournamentAbbreviation", "matchId", "dataTimeStart"],
				schema: editMatchSchema,
			});
		},
	);

	// Function to update date input value
	const updateDateInput = React.useCallback(() => {
		if (formRef.current) {
			const dateInput = formRef.current.querySelector<HTMLInputElement>(
				'input[name="dataTimeStart"]',
			);
			if (dateInput) {
				dateInput.value = formatDateForInput(modalType.match.startDate);
			}
		}
	}, [modalType.match.startDate]);

	// Update input value when modal opens
	const handleOpenModal = () => {
		modalRef.current?.showModal();
		// Use setTimeout to ensure modal is fully opened before updating
		// Using requestAnimationFrame for better timing
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				updateDateInput();
			});
		});
	};

	// Also update when match changes
	useEffect(() => {
		updateDateInput();
	}, [modalType.match.id, updateDateInput]);

	return (
		<>
			<button
				className={"btn btn-ghost btn-xs"}
				onClick={handleOpenModal}
				type={"button"}
			>
				Edit
			</button>

			<Modal ref={modalRef}>
				<h1>Edit match</h1>
				<form
					action={formActionEditMatch}
					ref={formRef}
					id={"edit-match"}
					key={`edit-match-${modalType.match.id}`}
				>
					<div className={"grid w-full max-w-5xl grid-cols-1 gap-4 rounded-lg p-4"}>
						<Input
							name={"tournamentAbbreviation"}
							label={"tournamentAbbreviation"}
							value={tournamentAbb}
							type={"hidden"}
							required={true}
						/>
						<Input
							name={"matchId"}
							label={"matchId"}
							value={modalType.match.id}
							type={"hidden"}
							required={true}
						/>
						<Input
							name={"stageType"}
							label={"stageType"}
							value={modalType.match.stage?.stageType || ""}
							type={"hidden"}
							required={true}
						/>
						<Input
							name={"dataTimeStart"}
							label={"Date and time start"}
							type={"datetime-local"}
							required={true}
							key={`dataTimeStart-${modalType.match.id}`}
							defaultValue={formatDateForInput(modalType.match.startDate)}
							errorMessage={
								stateEditMatch?.errors.dataTimeStart &&
								stateEditMatch?.errors.dataTimeStart[0]
							}
						/>
						<StaffMemberAutocomplete
							name={"refereeIds"}
							label={"Select referees"}
							tournamentAbbreviation={tournamentAbb}
							selectedOption={
								modalType.match.referees?.map((referee) => referee.id) || []
							}
							errorMessage={
								stateEditMatch?.errors.refereeIds &&
								stateEditMatch?.errors.refereeIds[0]
							}
						/>

						<StaffMemberAutocomplete
							name={"commentatorIds"}
							label={"Select commentators"}
							tournamentAbbreviation={tournamentAbb}
							selectedOption={
								modalType.match.commentators?.map((commentator) => commentator.id) || []
							}
							errorMessage={
								stateEditMatch?.errors.commentatorIds &&
								stateEditMatch?.errors.commentatorIds[0]
							}
						/>

						<StaffMemberAutocomplete
							name={"streamerIds"}
							label={"Select streamers"}
							tournamentAbbreviation={tournamentAbb}
							selectedOption={
								modalType.match.streamers?.map((streamer) => streamer.id) || []
							}
							errorMessage={
								stateEditMatch?.errors.streamerIds &&
								stateEditMatch?.errors.streamerIds[0]
							}
						/>
					</div>
					<Button className="mt-4 w-max" type={"submit"}>
						Update match
					</Button>
				</form>
			</Modal>
		</>
	);
};

