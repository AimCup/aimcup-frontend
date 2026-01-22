"use client";
import React, { useRef } from "react";
import { toast } from "sonner";
import { stageType } from "../../../../../../../client";
import { Button } from "@ui/atoms/Button/Button";
import Modal from "@ui/organisms/Modal/Modal";
import { ComboBox, type selectOptions } from "@ui/atoms/Forms/Select/ComboBox";
import { StaffMemberAutocomplete } from "@ui/atoms/Forms/Select/StaffMemberAutocomplete";
import { Input } from "@ui/atoms/Forms/Input/Input";
import { useTypeSafeFormState } from "@/hooks/useTypeSafeFormState";
import { editQualificationRoomsAction } from "@/actions/admin/adminQualificationRoomsActions";
import { resetFormValues, stageTypeEnumToString } from "@/lib/helpers";
import { editQualificationRoomsSchema } from "@/formSchemas/editQualificationRoomSchema";
import { addMatchSchema } from "@/formSchemas/addMachSchema";
import { addMatchAction } from "@/actions/admin/adminAddMatchActions";

type AddNewQRoom = {
	type: "add";
};

type EditQRoom = {
	type: "edit";
	room: {
		roomId: string;
		dataTimeStart: string;
		selectedStaffMemberOption: selectOptions[];
		selectedRosterIds: selectOptions[];
	};
	staffMemberSelectOptions: selectOptions[];
	rostersSelectOptions: selectOptions[];
};

type QRoomModalType = AddNewQRoom | EditQRoom;

interface IAddStaffMemberProps {
	tournamentAbb: string;
	modalType: QRoomModalType;
	teams: selectOptions[];
	staffMembers: selectOptions[];
}

export const MatchesModal = ({
	tournamentAbb,
	modalType,
	teams,
	staffMembers,
}: IAddStaffMemberProps) => {
	const modalRef = useRef<HTMLDialogElement>(null);
	const formRef = React.useRef<HTMLFormElement>(null);

	const stageTypeSelectOptions: selectOptions[] = [
		{
			id: stageType.FINAL,
			label: stageTypeEnumToString(stageType.FINAL),
		},
		{
			id: stageType.RO16,
			label: stageTypeEnumToString(stageType.RO16),
		},
		{
			id: stageType.RO64,
			label: stageTypeEnumToString(stageType.RO64),
		},
		{
			id: stageType.GRAND_FINAL,
			label: stageTypeEnumToString(stageType.GRAND_FINAL),
		},
		{
			id: stageType.QUARTER_FINAL,
			label: stageTypeEnumToString(stageType.QUARTER_FINAL),
		},
		{
			id: stageType.RO32,
			label: stageTypeEnumToString(stageType.RO32),
		},
		{
			id: stageType.RO128,
			label: stageTypeEnumToString(stageType.RO128),
		},
		{
			id: stageType.SEMI_FINAL,
			label: stageTypeEnumToString(stageType.SEMI_FINAL),
		},
	];

	const [stateCreateMatch, formCreateMatch] = useTypeSafeFormState(
		addMatchSchema,
		async (data) => {
			const addMatchActionResponse = await addMatchAction(data);
			if (!addMatchActionResponse.status) {
				return toast.error(addMatchActionResponse.errorMessage, {
					duration: 3000,
				});
			}
			modalRef.current?.close();
			// resetFormValues({
			// 	formRef,
			// 	resetWithoutInputNames: ["tournamentAbbreviation"],
			// 	schema: createQualificationRoomsSchema,
			// }); // todo, czyscieczenie
		},
	);

	const [stateEditQRoom, formActionEditQRoom] = useTypeSafeFormState(
		editQualificationRoomsSchema,
		async (data) => {
			const editMemberResponse = await editQualificationRoomsAction(data);
			if (!editMemberResponse.status) {
				return toast.error(editMemberResponse.errorMessage, {
					duration: 3000,
				});
			}
			modalRef.current?.close();
			resetFormValues({
				formRef,
				resetWithoutInputNames: ["tournamentAbbreviation", "roomId", "dataTimeStart"],
				schema: editQualificationRoomsSchema,
			});
		},
	); // todo nie dziala to sa w ogole glupoty tutaj

	return (
		<>
			{modalType.type === "add" ? (
				<Button
					className={"max-w-max"}
					onClick={() => modalRef?.current?.showModal()}
					type={"button"}
				>
					Add qualification rooms
				</Button>
			) : (
				<button
					className={"btn btn-ghost btn-xs"}
					onClick={() => modalRef?.current?.showModal()}
					type={"button"}
				>
					edit
				</button>
			)}

			<Modal ref={modalRef}>
				<h1>{modalType.type === "add" ? "Create match" : `Edit qualification rooms`}</h1>
				<form
					action={modalType.type === "add" ? formCreateMatch : formActionEditQRoom}
					ref={formRef}
					id={"staff-members"}
				>
					<div className={"grid w-full max-w-5xl grid-cols-1 gap-4 rounded-lg p-4"}>
						<Input
							name={"tournamentAbbreviation"}
							label={"tournamentAbbreviation"}
							value={tournamentAbb}
							type={"hidden"}
							required={true}
						/>
						<Input label={"Match ID"} name={"matchId"} required={true} />
						<Input
							name={"dataTimeStart"}
							label={"Date and time start"}
							type={"datetime-local"}
							required={true}
							defaultValue={
								modalType.type === "edit" ? modalType.room.dataTimeStart : undefined
							}
							errorMessage={
								(stateCreateMatch?.errors.dataTimeStart &&
									stateCreateMatch?.errors.dataTimeStart[0]) ||
								(stateEditQRoom?.errors.dataTimeStart &&
									stateEditQRoom?.errors.dataTimeStart[0])
							}
						/>
						<ComboBox
							// errorMessage={
							// 	(stateAddNewStage?.errors.stageType &&
							// 		stateAddNewStage?.errors.stageType[0]) ||
							// 	(stateEditStage?.errors.stageType &&
							// 		stateEditStage?.errors.stageType[0])
							// }
							// type={modalType.type === "edit" ? undefined : "hidden"}
							name={"stageType"}
							label={"Select stage type"}
							selectOptions={stageTypeSelectOptions}
							required={true}
							// selectedOption={
							// 	modalType.type !== "add"
							// 		? [
							// 				stageTypeSelectOptions.find(
							// 					(stage) => stage.id === modalType.stage.stageType,
							// 				)?.id || "",
							// 			]
							// 		: []
							// }
							readonly={modalType.type === "edit" ? true : false}
						/>
						<ComboBox
							// errorMessage={
							// 	(stateAddNewStage?.errors.stageType &&
							// 		stateAddNewStage?.errors.stageType[0]) ||
							// 	(stateEditStage?.errors.stageType &&
							// 		stateEditStage?.errors.stageType[0])
							// }
							name={"teamBlueId"}
							label={"Select blue team"}
							selectOptions={teams}
							required={true}
							// selectedOption={
							// 	modalType.type !== "add"
							// 		? [
							// 			stageTypeSelectOptions.find(
							// 				(stage) => stage.id === modalType.stage.stageType,
							// 			)?.id || "",
							// 		]
							// 		: []
							// }
							// readonly={modalType.type === "edit" ? true : false}
						/>
						<ComboBox
							// errorMessage={
							// 	(stateAddNewStage?.errors.stageType &&
							// 		stateAddNewStage?.errors.stageType[0]) ||
							// 	(stateEditStage?.errors.stageType &&
							// 		stateEditStage?.errors.stageType[0])
							// }
							name={"teamRedId"}
							label={"Select red team"}
							selectOptions={teams}
							required={true}
							// selectedOption={
							// 	modalType.type !== "add"
							// 		? [
							// 			stageTypeSelectOptions.find(
							// 				(stage) => stage.id === modalType.stage.stageType,
							// 			)?.id || "",
							// 		]
							// 		: []
							// }
							// readonly={modalType.type === "edit" ? true : false}
						/>
						<StaffMemberAutocomplete
							name={"refereeIds"}
							label={"Select referees"}
							tournamentAbbreviation={tournamentAbb}
							selectedOption={
								modalType.type === "edit"
									? staffMembers.map((staff) => staff.id)
									: []
							}
						/>

						<StaffMemberAutocomplete
							name={"commentatorIds"}
							label={"Select commentators"}
							tournamentAbbreviation={tournamentAbb}
							selectedOption={
								modalType.type === "edit"
									? staffMembers.map((staff) => staff.id)
									: []
							}
						/>

						<StaffMemberAutocomplete
							name={"streamerIds"}
							label={"Select streamers"}
							tournamentAbbreviation={tournamentAbb}
							selectedOption={
								modalType.type === "edit"
									? staffMembers.map((staff) => staff.id)
									: []
							}
						/>
					</div>
					<Button className="mt-4 w-max" type={"submit"}>
						{modalType.type === "add" ? "Add match" : "Edit qualification rooms"}
					</Button>
				</form>
			</Modal>
		</>
	);
};
