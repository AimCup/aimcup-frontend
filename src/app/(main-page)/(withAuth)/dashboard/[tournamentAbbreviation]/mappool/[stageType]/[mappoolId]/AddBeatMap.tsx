"use client";
import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { modification, type stageType } from "../../../../../../../../../client";
import { Button } from "@ui/atoms/Button/Button";
import { SubmitButton } from "@ui/atoms/Button/SubmitButton";
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
	stageType: stageType;
}

export const AddBeatMap = ({ tournamentAbb, mappoolId, stageType }: IAddStageFormProps) => {
	const modalRef = useRef<HTMLDialogElement>(null);
	const formRef = React.useRef<HTMLFormElement>(null);
	const router = useRouter();

	const [state, formAction] = useTypeSafeFormState(addBeatMapSchema, async (data) => {
		const addBeatMapResponse = await addBeatMapAction(data, stageType);
		if (!addBeatMapResponse.status) {
			return toast.error(addBeatMapResponse.errorMessage, {
				duration: 3000,
			});
		}
		toast.success("Beatmap added successfully", {
			duration: 3000,
		});
		modalRef.current?.close();
		resetFormValues({
			formRef,
			resetWithoutInputNames: ["tournamentAbb", "mappoolId"],
			schema: addBeatMapSchema,
		});
		router.refresh();
	});

	const handleOpenModal = () => {
		resetFormValues({
			formRef,
			resetWithoutInputNames: ["tournamentAbb", "mappoolId"],
			schema: addBeatMapSchema,
		});
		modalRef?.current?.showModal();
	};

	const modificationTypeSelectOptions = [
		{
			id: modification.DT,
			label: "DT",
		},
		{
			id: modification.HR,
			label: "HR",
		},
		{
			id: modification.HD,
			label: "HD",
		},
		{
			id: modification.FL,
			label: "FL",
		},
		{
			id: modification.EZ,
			label: "EZ",
		},
		{
			id: modification.NM,
			label: "NM",
		},
		{
			id: modification.TB,
			label: "TB",
		},
		{
			id: modification.FM,
			label: "FM",
		},
		{
			id: modification.HT,
			label: "HT",
		},
	];

	return (
		<>
			<Button onClick={handleOpenModal} type={"button"}>
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
						<Input
							name={"position"}
							label={"Position"}
							type={"number"}
							errorMessage={state?.errors.position && state?.errors.position[0]}
						/>
						<label className="label flex max-w-max cursor-pointer">
							<input type="checkbox" className="checkbox mr-5" name={"isCustom"} />
							<span className="label-text mr-auto">Is custom map?</span>
						</label>
						<label className="label flex max-w-max cursor-pointer">
							<input type="checkbox" className="checkbox mr-5" name={"isCustomSong"} />
							<span className="label-text mr-auto">Original song? <span className="text-gray-400 font-normal text-xs">(music made for this tournament)</span></span>
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
					<SubmitButton
						className="mt-4 rounded-md bg-deepRed px-6 py-2 text-white hover:opacity-80 disabled:opacity-50"
						pendingText="Creating…"
					>
						Create beatmap
					</SubmitButton>
				</form>
			</Modal>
		</>
	);
};
