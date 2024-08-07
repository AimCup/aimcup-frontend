"use client";
import React, { useRef } from "react";
import { toast } from "sonner";
import { Button } from "@ui/atoms/Button/Button";
import Modal from "@ui/organisms/Modal/Modal";
import { ComboBox, type selectOptions } from "@ui/atoms/Forms/Select/ComboBox";
import { Input } from "@ui/atoms/Forms/Input/Input";
import { useTypeSafeFormState } from "@/hooks/useTypeSafeFormState";
import { createQualificationRoomsSchema } from "@/formSchemas/createQualificationRoomsSchema";
import {
	createQualificationRoomsAction,
	editQualificationRoomsAction,
} from "@/actions/admin/adminQualificationRoomsActions";
import { resetFormValues } from "@/lib/helpers";
import { editQualificationRoomsSchema } from "@/formSchemas/editQualificationRoomSchema";

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
}

export const QualificationRoomModal = ({ tournamentAbb, modalType }: IAddStaffMemberProps) => {
	const modalRef = useRef<HTMLDialogElement>(null);
	const formRef = React.useRef<HTMLFormElement>(null);

	const [stateAddNewQRoom, formActionAddNewQRoom] = useTypeSafeFormState(
		createQualificationRoomsSchema,
		async (data) => {
			const createQualificationRoomsActionResponse =
				await createQualificationRoomsAction(data);
			if (!createQualificationRoomsActionResponse.status) {
				return toast.error(createQualificationRoomsActionResponse.errorMessage, {
					duration: 3000,
				});
			}
			modalRef.current?.close();
			resetFormValues({
				formRef,
				resetWithoutInputNames: ["tournamentAbbreviation"],
				schema: createQualificationRoomsSchema,
			});
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
	);

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
				<h1>
					{modalType.type === "add"
						? "Add qualification rooms"
						: `Edit qualification rooms`}
				</h1>
				<form
					action={modalType.type === "add" ? formActionAddNewQRoom : formActionEditQRoom}
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
						<Input
							type={modalType.type === "edit" ? "hidden" : "number"}
							name={"amount"}
							label={"Amount"}
							required={true}
							disabled={modalType.type === "edit"}
							errorMessage={
								stateAddNewQRoom?.errors.amount &&
								stateAddNewQRoom?.errors.amount[0]
							}
						/>
						<Input
							name={"dataTimeStart"}
							label={"Date and time start"}
							type={"datetime-local"}
							required={true}
							defaultValue={
								modalType.type === "edit" ? modalType.room.dataTimeStart : undefined
							}
							errorMessage={
								(stateAddNewQRoom?.errors.dataTimeStart &&
									stateAddNewQRoom?.errors.dataTimeStart[0]) ||
								(stateEditQRoom?.errors.dataTimeStart &&
									stateEditQRoom?.errors.dataTimeStart[0])
							}
						/>
						<Input
							name={"roomId"}
							type={"hidden"}
							required={true}
							value={modalType.type === "edit" ? modalType.room.roomId : undefined}
						/>
						<Input
							type={modalType.type === "edit" ? "hidden" : "number"}
							name={"offset"}
							label={"Offset"}
							required={true}
							max={24}
							disabled={modalType.type === "edit"}
							errorMessage={
								stateAddNewQRoom?.errors.offset &&
								stateAddNewQRoom?.errors.offset[0]
							}
						/>
						<ComboBox
							name={"staffMemberId"}
							label={"Select staff member"}
							disabled={modalType.type === "add"}
							selectOptions={
								modalType.type === "edit" ? modalType.staffMemberSelectOptions : []
							}
							selectedOption={
								modalType.type === "edit"
									? [modalType.room.selectedStaffMemberOption[0].id]
									: undefined
							}
							type={modalType.type === "edit" ? undefined : "hidden"}
							errorMessage={
								stateEditQRoom?.errors.staffMemberId &&
								stateEditQRoom?.errors.staffMemberId[0]
							}
						/>
						<ComboBox
							name={"rosterIds"}
							label={"Select rosters"}
							selectOptions={
								modalType.type === "edit" ? modalType.rostersSelectOptions : []
							}
							selectedOption={
								modalType.type === "edit"
									? modalType.room.selectedRosterIds.map((roster) => roster.id)
									: undefined
							}
							type={modalType.type === "edit" ? undefined : "hidden"}
							disabled={modalType.type === "add"}
							hidden={modalType.type === "add"}
							multiple={true}
							errorMessage={
								stateEditQRoom?.errors.rosterIds &&
								stateEditQRoom?.errors.rosterIds[0]
							}
						/>
					</div>
					<Button className="mt-4 w-max" type={"submit"}>
						{modalType.type === "add"
							? "Add qualification rooms"
							: "Edit qualification rooms"}
					</Button>
				</form>
			</Modal>
		</>
	);
};
