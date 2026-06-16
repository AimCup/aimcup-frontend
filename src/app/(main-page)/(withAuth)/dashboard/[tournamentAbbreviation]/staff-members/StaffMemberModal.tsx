"use client";
import React, { useRef } from "react";
import { toast } from "sonner";
import { Button } from "@ui/atoms/Button/Button";
import { SubmitButton } from "@ui/atoms/Button/SubmitButton";
import Modal from "@ui/organisms/Modal/Modal";
import { ComboBox, type selectOptions } from "@ui/atoms/Forms/Select/ComboBox";
import { Input } from "@ui/atoms/Forms/Input/Input";
import { useTypeSafeFormState } from "@/hooks/useTypeSafeFormState";
import { addEditStaffMembersSchema } from "@/formSchemas/addEditStaffMembersSchema";
import {
	addStaffMemberAction,
	editStaffMemberAction,
} from "@/actions/admin/adminStaffMembersActions";
import { resetFormValues } from "@/lib/helpers";

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
				return toast.error("Failed to add staff member.", {
					duration: 4000,
				});
			}
			toast.success("Staff member added.", { duration: 2500 });
			modalRef.current?.close();
			resetFormValues({
				formRef,
				resetWithoutInputNames: ["tournamentAbbreviation"],
				schema: addEditStaffMembersSchema,
			});
		},
	);

	const [stateEditMemberStaff, formActionEditMemberStaff] = useTypeSafeFormState(
		addEditStaffMembersSchema,
		async (data) => {
			const editMemberResponse = await editStaffMemberAction(data);
			if (!editMemberResponse.status) {
				return toast.error("Failed to edit staff member.", {
					duration: 4000,
				});
			}
			toast.success("Staff member updated.", { duration: 2500 });
			modalRef.current?.close();
			resetFormValues({
				formRef,
				resetWithoutInputNames: ["osuId", "discordId", "roles", "permissions"],
				schema: addEditStaffMembersSchema,
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
							selectedOption={
								modalType.type === "edit"
									? modalType.user.roles.map((role) => role.id)
									: []
							}
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
							selectedOption={
								modalType.type === "edit"
									? modalType.user.permissions.map((permission) => permission.id)
									: []
							}
							multiple={true}
							errorMessage={
								(stateAddNewMemberStaff?.errors.permissions &&
									stateAddNewMemberStaff?.errors.permissions[0]) ||
								(stateEditMemberStaff?.errors.permissions &&
									stateEditMemberStaff?.errors.permissions[0])
							}
						/>
					</div>
					<SubmitButton className="mt-4 w-max rounded-md bg-deepRed px-6 py-2 text-white hover:opacity-80 disabled:opacity-50">
						{modalType.type === "add" ? "Add staff member" : "Edit staff member"}
					</SubmitButton>
				</form>
			</Modal>
		</>
	);
};
