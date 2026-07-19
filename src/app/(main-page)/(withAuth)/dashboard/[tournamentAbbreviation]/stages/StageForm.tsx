"use client";
import React, { useRef } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { stageType } from "../../../../../../../client";
import { Button } from "@ui/atoms/Button/Button";
import { SubmitButton } from "@ui/atoms/Button/SubmitButton";
import Modal from "@ui/organisms/Modal/Modal";
import { ComboBox, type selectOptions } from "@ui/atoms/Forms/Select/ComboBox";
import { useTypeSafeFormState } from "@/hooks/useTypeSafeFormState";
import { resetFormValues, stageTypeEnumToString } from "@/lib/helpers";
import { Input } from "@ui/atoms/Forms/Input/Input";
import { createStageSchema, editStageSchema } from "@/formSchemas/createStageSchema";
import { createStageAction, editStageAction } from "@/actions/admin/adminStageActions";

type AddNewStage = {
	type: "add";
};

type EditStage = {
	type: "edit";
	stage: {
		stageType: string;
		dateStart: string;
		dateEnd: string;
		showInSchedule: boolean;
	};
};

type StageModalType = AddNewStage | EditStage;

interface IAddStageFormProps {
	tournamentAbb: string;
	alreadyAddedStages?: stageType[];
	modalType: StageModalType;
}

export const StageForm = ({ modalType, tournamentAbb, alreadyAddedStages }: IAddStageFormProps) => {
	const modalRef = useRef<HTMLDialogElement>(null);
	const formRef = React.useRef<HTMLFormElement>(null);

	const [stateAddNewStage, addNewStageFormAction] = useTypeSafeFormState(
		createStageSchema,
		async (data) => {
			const stageResponse = await createStageAction(data);
			if (!stageResponse.status) {
				return toast.error(stageResponse.errorMessage, {
					duration: 3000,
				});
			}

			toast.success("Stage created.", { duration: 2500 });
			modalRef.current?.close();
			resetFormValues({
				formRef,
				// showInSchedule is excluded because resetting a checkbox force-unchecks it, which would
				// make the next stage default to hidden instead of visible.
				resetWithoutInputNames: ["tournamentAbb", "showInSchedule"],
				schema: createStageSchema,
			});
		},
	);

	const [stateEditStage, editStageFormAction] = useTypeSafeFormState(
		editStageSchema,
		async (data) => {
			const stageResponse = await editStageAction(data);
			if (!stageResponse.status) {
				return toast.error(stageResponse.errorMessage, {
					duration: 3000,
				});
			}

			toast.success("Stage updated.", { duration: 2500 });
			modalRef.current?.close();
		},
	);

	const stageTypeSelectOptions: selectOptions[] = [
		{
			id: stageType.REGISTRATION,
			label: stageTypeEnumToString(stageType.REGISTRATION),
		},
		{
			id: stageType.QUALIFICATION,
			label: stageTypeEnumToString(stageType.QUALIFICATION),
		},
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
		{
			id: stageType.SCREENING,
			label: stageTypeEnumToString(stageType.SCREENING),
		},
		{
			id: stageType.SWISS_1,
			label: stageTypeEnumToString(stageType.SWISS_1),
		},
		{
			id: stageType.SWISS_2,
			label: stageTypeEnumToString(stageType.SWISS_2),
		},
		{
			id: stageType.SWISS_3,
			label: stageTypeEnumToString(stageType.SWISS_3),
		},
		{
			id: stageType.SWISS_4,
			label: stageTypeEnumToString(stageType.SWISS_4),
		},
		{
			id: stageType.SWISS_5,
			label: stageTypeEnumToString(stageType.SWISS_5),
		},
		{
			id: stageType.SWISS_6,
			label: stageTypeEnumToString(stageType.SWISS_6),
		},
	].filter((stage) => !alreadyAddedStages?.includes(stage.id));

	return (
		<>
			{modalType.type === "add" ? (
				<Button
					onClick={() => modalRef?.current?.showModal()}
					type={"button"}
					disabled={stageTypeSelectOptions.length === 0}
					className={"max-w-max"}
				>
					Add stage
				</Button>
			) : (
				<button
					className={"btn btn-ghost btn-xs"}
					onClick={() => modalRef?.current?.showModal()}
					type={"button"}
				>
					Edit
				</button>
			)}

			<Modal ref={modalRef}>
				<h1>{modalType.type === "add" ? "Add stage" : `Edit stage`}</h1>
				<form
					action={modalType.type === "add" ? addNewStageFormAction : editStageFormAction}
					ref={formRef}
					id={"add-stage"}
				>
					<div className={"grid w-full max-w-5xl grid-cols-1 gap-4 rounded-lg p-4"}>
						<ComboBox
							errorMessage={
								(stateAddNewStage?.errors.stageType &&
									stateAddNewStage?.errors.stageType[0]) ||
								(stateEditStage?.errors.stageType &&
									stateEditStage?.errors.stageType[0])
							}
							name={"stageType"}
							label={"Select stage type"}
							selectOptions={stageTypeSelectOptions}
							required={true}
							selectedOption={
								modalType.type !== "add"
									? [
											stageTypeSelectOptions.find(
												(stage) => stage.id === modalType.stage.stageType,
											)?.id || "",
										]
									: []
							}
							readonly={modalType.type === "edit" ? true : false}
						/>
						<Input
							errorMessage={
								(stateAddNewStage?.errors.startDate &&
									stateAddNewStage?.errors.startDate[0]) ||
								(stateEditStage?.errors.startDate &&
									stateEditStage?.errors.startDate[0])
							}
							name={"startDate"}
							type={"date"}
							label={"Start date"}
							required={true}
							defaultValue={
								modalType.type === "edit"
									? format(new Date(modalType.stage.dateStart), "yyyy-MM-dd")
									: undefined
							}
						/>
						<Input
							errorMessage={
								(stateAddNewStage?.errors.endDate &&
									stateAddNewStage?.errors.endDate[0]) ||
								(stateEditStage?.errors.endDate &&
									stateEditStage?.errors.endDate[0])
							}
							name={"endDate"}
							type={"date"}
							label={"Start end"}
							required={true}
							defaultValue={
								modalType.type === "edit"
									? format(new Date(modalType.stage.dateEnd), "yyyy-MM-dd")
									: undefined
							}
						/>
						<div className={"form-control"}>
							<label className={"label flex cursor-pointer justify-start gap-4"}>
								<input
									type={"checkbox"}
									name={"showInSchedule"}
									className={"checkbox"}
									defaultChecked={
										modalType.type === "edit" ? modalType.stage.showInSchedule : true
									}
								/>
								<span className={"label-text"}>Show as its own stage</span>
							</label>
							<span className={"pl-1 text-xs opacity-60"}>
								Untick for rounds that share another stage&apos;s mappool (e.g. later Swiss
								rounds). They disappear from the public schedule and the mappool menu, but
								matches can still be created for them.
							</span>
						</div>
						<Input
							errorMessage={
								(stateAddNewStage?.errors.tournamentAbb &&
									stateAddNewStage?.errors.tournamentAbb[0]) ||
								(stateEditStage?.errors.tournamentAbb &&
									stateEditStage?.errors.tournamentAbb[0])
							}
							name={"tournamentAbb"}
							type={"hidden"}
							label={"TournamentAbb"}
							value={tournamentAbb}
						/>
					</div>
					<SubmitButton
						className="mt-4 text-white rounded-md bg-deepRed px-6 py-2 hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 max-w-max"
						pendingText={modalType.type === "add" ? "Creating…" : "Saving…"}
					>
						{modalType.type === "add" ? "Create stage" : "Edit stage"}
					</SubmitButton>
				</form>
			</Modal>
		</>
	);
};
