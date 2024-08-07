"use client";
import React, { useRef } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { StageResponseDto } from "../../../../../../../generated";
import { Button } from "@ui/atoms/Button/Button";
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
	};
};

type StageModalType = AddNewStage | EditStage;

interface IAddStageFormProps {
	tournamentAbb: string;
	alreadyAddedStages?: StageResponseDto.stageType[];
	modalType: StageModalType;
}

export const StageForm = ({ modalType, tournamentAbb, alreadyAddedStages }: IAddStageFormProps) => {
	const modalRef = useRef<HTMLDialogElement>(null);
	const formRef = React.useRef<HTMLFormElement>(null);

	const [stateAddNewStage, addNewStageFormAction] = useTypeSafeFormState(
		createStageSchema,
		async (data) => {
			const stageResponse = await createStageAction(data);
			console.log(stageResponse);
			if (!stageResponse.status) {
				return toast.error(stageResponse.errorMessage, {
					duration: 3000,
				});
			}

			modalRef.current?.close();
			resetFormValues({
				formRef,
				resetWithoutInputNames: ["tournamentAbb"],
				schema: createStageSchema,
			});
		},
	);

	const [stateEditStage, editStageFormAction] = useTypeSafeFormState(
		editStageSchema,
		async (data) => {
			const stageResponse = await editStageAction(data);
			console.log(stageResponse);
			if (!stageResponse.status) {
				return toast.error(stageResponse.errorMessage, {
					duration: 3000,
				});
			}

			modalRef.current?.close();
		},
	);

	const stageTypeSelectOptions: selectOptions[] = [
		{
			id: StageResponseDto.stageType.REGISTRATION,
			label: stageTypeEnumToString(StageResponseDto.stageType.REGISTRATION),
		},
		{
			id: StageResponseDto.stageType.QUALIFICATION,
			label: stageTypeEnumToString(StageResponseDto.stageType.QUALIFICATION),
		},
		{
			id: StageResponseDto.stageType.FINAL,
			label: stageTypeEnumToString(StageResponseDto.stageType.FINAL),
		},
		{
			id: StageResponseDto.stageType.RO16,
			label: stageTypeEnumToString(StageResponseDto.stageType.RO16),
		},
		{
			id: StageResponseDto.stageType.RO64,
			label: stageTypeEnumToString(StageResponseDto.stageType.RO64),
		},
		{
			id: StageResponseDto.stageType.GRAND_FINAL,
			label: stageTypeEnumToString(StageResponseDto.stageType.GRAND_FINAL),
		},
		{
			id: StageResponseDto.stageType.QUARTER_FINAL,
			label: stageTypeEnumToString(StageResponseDto.stageType.QUARTER_FINAL),
		},
		{
			id: StageResponseDto.stageType.RO32,
			label: stageTypeEnumToString(StageResponseDto.stageType.RO32),
		},
		{
			id: StageResponseDto.stageType.RO128,
			label: stageTypeEnumToString(StageResponseDto.stageType.RO128),
		},
		{
			id: StageResponseDto.stageType.SEMI_FINAL,
			label: stageTypeEnumToString(StageResponseDto.stageType.SEMI_FINAL),
		},
		{
			id: StageResponseDto.stageType.SCREENING,
			label: stageTypeEnumToString(StageResponseDto.stageType.SCREENING),
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
					<Button className="mt-4 w-max" type={"submit"}>
						{modalType.type === "add" ? "Create stage" : "Edit stage"}
					</Button>
				</form>
			</Modal>
		</>
	);
};
