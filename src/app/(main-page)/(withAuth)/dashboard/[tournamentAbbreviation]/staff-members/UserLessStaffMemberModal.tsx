"use client";
import React, { useRef } from "react";
import { toast } from "sonner";
import { Button } from "@ui/atoms/Button/Button";
import Modal from "@ui/organisms/Modal/Modal";
import { ComboBox, type selectOptions } from "@ui/atoms/Forms/Select/ComboBox";
import { Input } from "@ui/atoms/Forms/Input/Input";
import { useTypeSafeFormState } from "@/hooks/useTypeSafeFormState";
import { addUserLessStaffMemberAction } from "@/actions/admin/adminStaffMembersActions";
import { addEditUserLessStaffMembersSchema } from "@/formSchemas/addEditUserLessStaffMembersSchema";

type AddNewStaffMember = {
	type: "add";
};

type EditStaffMember = {
	type: "edit";
	username: string;
	imageUrl: string;
	redirectUrl: string;
	roles: {
		id: string;
		label: string;
	}[];
	// todo dodać liste permisji i ról aby można było wyświetlić zaznaczone jak w QualificationRoomModal.tsx
};

type StaffMemberModalType = AddNewStaffMember | EditStaffMember;

interface IAddStaffMemberProps {
	tournamentAbb: string;
	rolesSelectOptions: selectOptions[];
	modalType: StaffMemberModalType;
}

export const UserLessStaffMemberModal = ({
	tournamentAbb,
	rolesSelectOptions,
	modalType,
}: IAddStaffMemberProps) => {
	const modalRef = useRef<HTMLDialogElement>(null);
	const formRef = React.useRef<HTMLFormElement>(null);

	const [stateAddNewMemberStaff, formActionAddNewMemberStaff] = useTypeSafeFormState(
		addEditUserLessStaffMembersSchema,
		async (data) => {
			const addStaffMemberResponse = await addUserLessStaffMemberAction(data);
			if (!addStaffMemberResponse.status) {
				return toast.error("error", {
					duration: 3000,
				});
			}
			modalRef.current?.close();
			resetForm(["tournamentAbbreviation"]);
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
					Add user-less staff member
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
				<form action={formActionAddNewMemberStaff} ref={formRef} id={"staff-members"}>
					<div className={"grid w-full max-w-5xl grid-cols-1 gap-4 rounded-lg p-4"}>
						<Input
							name={"tournamentAbbreviation"}
							label={"tournamentAbbreviation"}
							value={tournamentAbb}
							type={"hidden"}
							required={true}
						/>
						<Input
							type={modalType.type === "edit" ? "hidden" : "text"}
							name={"username"}
							label={"Nickname"}
							errorMessage={
								stateAddNewMemberStaff?.errors.username &&
								stateAddNewMemberStaff?.errors.username[0]
							}
							required={true}
							value={(modalType.type === "edit" && modalType.username) || undefined}
						/>
						<Input
							name={"redirectUrl"}
							label={"Redirect URL"}
							errorMessage={
								stateAddNewMemberStaff?.errors.redirectUrl &&
								stateAddNewMemberStaff?.errors.redirectUrl[0]
							}
						/>
						<Input
							name={"imageUrl"}
							label={"Image URL"}
							errorMessage={
								stateAddNewMemberStaff?.errors.imageUrl &&
								stateAddNewMemberStaff?.errors.imageUrl[0]
							}
						/>
						<ComboBox
							name={"roles"}
							label={"Roles"}
							selectOptions={rolesSelectOptions}
							multiple={true}
							errorMessage={
								stateAddNewMemberStaff?.errors.roles &&
								stateAddNewMemberStaff?.errors.roles[0]
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
