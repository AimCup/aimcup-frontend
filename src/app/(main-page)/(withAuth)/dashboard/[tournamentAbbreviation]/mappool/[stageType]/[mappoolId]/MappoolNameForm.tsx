"use client";

import React, { useRef } from "react";
import { toast } from "sonner";
import { type stageType } from "../../../../../../../../../client";
import { SubmitButton } from "@ui/atoms/Button/SubmitButton";
import Modal from "@ui/organisms/Modal/Modal";
import { Input } from "@ui/atoms/Forms/Input/Input";
import { useTypeSafeFormState } from "@/hooks/useTypeSafeFormState";
import { mappoolNameSchema } from "@/formSchemas/mappoolNameSchema";
import { updateMappoolNameAction } from "@/actions/admin/adminMappoolNameActions";
import { stageTypeEnumToString } from "@/lib/helpers";

export function MappoolNameForm({
	tournamentAbbreviation,
	stageTypeValue,
	displayName,
}: {
	tournamentAbbreviation: string;
	stageTypeValue: stageType;
	displayName?: string;
}) {
	const modalRef = useRef<HTMLDialogElement>(null);

	const [state, formAction] = useTypeSafeFormState(mappoolNameSchema, async (data) => {
		const result = await updateMappoolNameAction(data);
		if (!result.status) {
			return toast.error(result.errorMessage, { duration: 3000 });
		}
		toast.success(
			data.displayName.trim() ? "Mappool renamed." : "Custom name cleared.",
			{ duration: 2500 },
		);
		modalRef.current?.close();
	});

	return (
		<>
			<button
				className="btn btn-ghost btn-sm"
				onClick={() => modalRef.current?.showModal()}
				type="button"
			>
				Rename
			</button>

			<Modal ref={modalRef}>
				<h1>Rename mappool</h1>
				<form action={formAction}>
					<div className="grid w-full max-w-5xl grid-cols-1 gap-4 rounded-lg p-4">
						<Input
							name="tournamentAbb"
							label="tournamentAbb"
							type="hidden"
							value={tournamentAbbreviation}
						/>
						<Input
							name="stageType"
							label="stageType"
							type="hidden"
							value={stageTypeValue}
						/>
						<Input
							name="displayName"
							label="Display name"
							type="text"
							defaultValue={displayName ?? ""}
							errorMessage={state?.errors.displayName && state?.errors.displayName[0]}
						/>
						<span className="pl-1 text-xs opacity-60">
							Shown wherever this pool is listed, instead of the stage name. Leave empty to
							go back to &quot;{stageTypeEnumToString(stageTypeValue)}&quot;.
						</span>
					</div>
					<SubmitButton
						className="mt-4 max-w-max rounded-md bg-deepRed px-6 py-2 text-white hover:opacity-80 disabled:opacity-50"
						pendingText="Saving…"
					>
						Save name
					</SubmitButton>
				</form>
			</Modal>
		</>
	);
}
