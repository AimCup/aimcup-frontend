"use client";
import React, { useRef } from "react";
import { toast } from "sonner";
import { StageResponseDto } from "../../../../../../generated";
import { Button } from "@ui/atoms/Button/Button";
import Modal from "@ui/organisms/Modal/Modal";
import { ComboBox, type selectOptions } from "@ui/atoms/Forms/Select/ComboBox";
import { useTypeSafeFormState } from "@/hooks/useTypeSafeFormState";
import { stageTypeEnumToString } from "@/lib/helpers";
import { Input } from "@ui/atoms/Forms/Input/Input";
import { createStageSchema } from "@/formSchemas/createStageSchema";
import { createStageAction } from "@/actions/createStageAction";

interface IAddStageFormProps {
	tournamentAbb: string;
	alreadyAddedStages?: StageResponseDto.stageType[];
}

export const AddStageForm = ({ tournamentAbb, alreadyAddedStages }: IAddStageFormProps) => {
	const modalRef = useRef<HTMLDialogElement>(null);
	const formRef = React.useRef<HTMLFormElement>(null);

	const [_state, formAction] = useTypeSafeFormState(createStageSchema, async (data) => {
		const stageResponse = await createStageAction(data);
		console.log(stageResponse);
		if (!stageResponse.status) {
			return toast.error(stageResponse.errorMessage, {
				duration: 3000,
			});
		}

		modalRef.current?.close();
		resetForm();
	});

	const resetForm = () => {
		if (formRef.current) {
			const inputs = formRef.current.querySelectorAll<
				HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
			>("input, select, textarea");
			inputs.forEach((input) => {
				if (input.name !== "tournamentAbb") {
					input.value = "";
				}
			});
		}
	};

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
			<Button
				onClick={() => modalRef?.current?.showModal()}
				type={"button"}
				disabled={stageTypeSelectOptions.length === 0}
			>
				Add stage
			</Button>

			<Modal ref={modalRef}>
				<h1>Add stage</h1>
				<form action={formAction} ref={formRef} id={"add-stage"}>
					<div className={"grid w-full max-w-5xl grid-cols-1 gap-4 rounded-lg p-4"}>
						<ComboBox
							name={"stageType"}
							label={"Select stage type"}
							selectOptions={stageTypeSelectOptions}
						/>
						<Input
							name={"startDate"}
							type={"date"}
							label={"Start date"}
							required={true}
						/>
						<Input name={"endDate"} type={"date"} label={"Start end"} required={true} />
						<Input
							name={"tournamentAbb"}
							type={"hidden"}
							label={"TournamentAbb"}
							value={tournamentAbb}
						/>
					</div>
					<Button className="mt-4 w-max" type={"submit"}>
						Create stage
					</Button>
				</form>
			</Modal>
		</>
	);
};
