"use client";
import React, { useRef } from "react";
import { toast } from "sonner";
import { BeatmapModificationResponseDto } from "../../../../../../../../../generated";
import { Button } from "@ui/atoms/Button/Button";
import Modal from "@ui/organisms/Modal/Modal";
import { ComboBox } from "@ui/atoms/Forms/Select/ComboBox";
import { Input } from "@ui/atoms/Forms/Input/Input";
import { useTypeSafeFormState } from "@/hooks/useTypeSafeFormState";
import { addBeatMapSchema } from "@/formSchemas/addBeatMapSchema";
import { resetFormValues } from "@/lib/helpers";
import { addBeatMapAction } from "@/actions/admin/adminBeatMapActions";

interface IAddStageFormProps {
	tournamentAbb: string;
	mappoolId: string;
}

export const AddBeatMap = ({ tournamentAbb, mappoolId }: IAddStageFormProps) => {
	const modalRef = useRef<HTMLDialogElement>(null);
	const formRef = React.useRef<HTMLFormElement>(null);

	const [state, formAction] = useTypeSafeFormState(addBeatMapSchema, async (data) => {
		const addBeatMapResponse = await addBeatMapAction(data);
		if (!addBeatMapResponse.status) {
			return toast.error(addBeatMapResponse.errorMessage, {
				duration: 3000,
			});
		}
		modalRef.current?.close();
		resetFormValues({
			formRef,
			resetWithoutInputNames: ["tournamentAbb", "mappoolId"],
			schema: addBeatMapSchema,
		});
	});

	const modificationTypeSelectOptions = [
		{
			id: BeatmapModificationResponseDto.modification.DT,
			label: "DT",
		},
		{
			id: BeatmapModificationResponseDto.modification.HR,
			label: "HR",
		},
		{
			id: BeatmapModificationResponseDto.modification.HD,
			label: "HD",
		},
		{
			id: BeatmapModificationResponseDto.modification.FL,
			label: "FL",
		},
		{
			id: BeatmapModificationResponseDto.modification.EZ,
			label: "EZ",
		},
		{
			id: BeatmapModificationResponseDto.modification.NM,
			label: "NM",
		},
		{
			id: BeatmapModificationResponseDto.modification.TB,
			label: "TB",
		},
		{
			id: BeatmapModificationResponseDto.modification.FM,
			label: "FM",
		},
		{
			id: BeatmapModificationResponseDto.modification.HT,
			label: "HT",
		},
	];

	return (
		<>
			<Button onClick={() => modalRef?.current?.showModal()} type={"button"}>
				Add beatmap
			</Button>

			<Modal ref={modalRef}>
				<h1>Create beatmap</h1>
				<form action={formAction} ref={formRef} id={"create-beatmap"}>
					<div className={"grid w-full max-w-5xl grid-cols-1 gap-4 rounded-lg p-4"}>
						<ComboBox
							name={"modification"}
							label={"Select modification"}
							selectOptions={modificationTypeSelectOptions}
							errorMessage={
								state?.errors.modification && state?.errors.modification[0]
							}
						/>
						<Input
							name={"url"}
							label={"Url"}
							errorMessage={state?.errors.url && state?.errors.url[0]}
						/>
						<label className="label flex max-w-max cursor-pointer">
							<input type="checkbox" className="checkbox mr-5" name={"isCustom"} />
							<span className="label-text mr-auto">Is custom?</span>
						</label>
						<Input
							name={"tournamentAbb"}
							type={"hidden"}
							label={"TournamentAbb"}
							value={tournamentAbb}
						/>
						<Input
							name={"mappoolId"}
							type={"hidden"}
							label={"mappoolId"}
							value={mappoolId}
						/>
					</div>
					<Button className="mt-4 w-max" type={"submit"}>
						Create beatmap
					</Button>
				</form>
			</Modal>
		</>
	);
};
