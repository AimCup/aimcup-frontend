"use client";
import React, { useRef } from "react";
import { toast } from "sonner";
import { Button } from "@ui/atoms/Button/Button";
import Modal from "@ui/organisms/Modal/Modal";
import { ComboBox, type selectOptions } from "@ui/atoms/Forms/Select/ComboBox";
import { Input } from "@ui/atoms/Forms/Input/Input";
import { useTypeSafeFormState } from "@/hooks/useTypeSafeFormState";
import { addEditStaffMembersSchema } from "@/formSchemas/addEditStaffMembersSchema";
import {
	addStaffMemberAction,
	editStaffMemberAction,
} from "@/actions/admin/adminStaffMembersActions";

type AddNewStaffMember = {
	type: "add";
};

type EditStaffMember = {
	type: "edit";
	user: {
		osuId: string;
		discordId: string;
		roles: {
			id: string;
			label: string;
		}[];
		permissions: {
			id: string;
			label: string;
		}[];
	};
	// todo dodać liste permisji i ról aby można było wyświetlić zaznaczone jak w QualificationRoomModal.tsx
};

type StaffMemberModalType = AddNewStaffMember | EditStaffMember;

interface IAddStaffMemberProps {
	tournamentAbb: string;
	rolesSelectOptions: selectOptions[];
	permissionsSelectOptions: selectOptions[];
	modalType: StaffMemberModalType;
}

export const StaffMemberModal = ({
	tournamentAbb,
	rolesSelectOptions,
	permissionsSelectOptions,
	modalType,
}: IAddStaffMemberProps) => {
	const modalRef = useRef<HTMLDialogElement>(null);
	const formRef = React.useRef<HTMLFormElement>(null);

	const [stateAddNewMemberStaff, formActionAddNewMemberStaff] = useTypeSafeFormState(
		addEditStaffMembersSchema,
		async (data) => {
			const addStaffMemberResponse = await addStaffMemberAction(data);
			if (!addStaffMemberResponse.status) {
				return toast.error(addStaffMemberResponse.errorMessage, {
					duration: 3000,
				});
			}
			modalRef.current?.close();
			resetForm(["tournamentAbbreviation"]);
		},
	);

	const [stateEditMemberStaff, formActionEditMemberStaff] = useTypeSafeFormState(
		addEditStaffMembersSchema,
		async (data) => {
			const editMemberResponse = await editStaffMemberAction(data);
			if (!editMemberResponse.status) {
				return toast.error(editMemberResponse.errorMessage, {
					duration: 3000,
				});
			}
			modalRef.current?.close();
			resetForm(["tournamentAbbreviation, osuId"]);
		},
	);

	const resetForm = (inputNames: string[]) => {
		if (formRef.current) {
			const inputs = formRef.current.querySelectorAll<
				HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
			>("input, select, textarea");
			inputs.forEach((input) => {
				if (!inputNames.includes(input.name)) {
					input.value = "";
				}
			});
		}
	};

	return (
		<>
			{modalType.type === "add" ? (
				<Button
					className={"max-w-max"}
					onClick={() => modalRef?.current?.showModal()}
					type={"button"}
				>
					Add staff member
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
				<h1>{modalType.type === "add" ? "Add staff members" : `Edit staff member`}</h1>
				<form
					action={
						modalType.type === "add"
							? formActionAddNewMemberStaff
							: formActionEditMemberStaff
					}
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
							name={"osuId"}
							label={"OSU ID"}
							errorMessage={
								stateAddNewMemberStaff?.errors.osuId &&
								stateAddNewMemberStaff?.errors.osuId[0]
							}
							required={true}
							value={(modalType.type === "edit" && modalType.user.osuId) || undefined}
						/>
						<Input
							name={"discordId"}
							label={"Discord ID"}
							errorMessage={
								(stateAddNewMemberStaff?.errors.discordId &&
									stateAddNewMemberStaff?.errors.discordId[0]) ||
								(stateEditMemberStaff?.errors.discordId &&
									stateEditMemberStaff?.errors.discordId[0])
							}
						/>

						<ComboBox
							name={"roles"}
							label={"Roles"}
							selectOptions={rolesSelectOptions}
							multiple={true}
							errorMessage={
								(stateAddNewMemberStaff?.errors.roles &&
									stateAddNewMemberStaff?.errors.roles[0]) ||
								(stateEditMemberStaff?.errors.roles &&
									stateEditMemberStaff?.errors.roles[0])
							}
						/>
						<ComboBox
							name={"permissions"}
							label={"Select permissions"}
							selectOptions={permissionsSelectOptions}
							multiple={true}
							errorMessage={
								(stateAddNewMemberStaff?.errors.permissions &&
									stateAddNewMemberStaff?.errors.permissions[0]) ||
								(stateEditMemberStaff?.errors.permissions &&
									stateEditMemberStaff?.errors.permissions[0])
							}
						/>
					</div>
					<Button className="mt-4 w-max" type={"submit"}>
						{modalType.type === "add" ? "Add staff member" : "Edit staff member"}
					</Button>
				</form>
			</Modal>
		</>
	);
};
