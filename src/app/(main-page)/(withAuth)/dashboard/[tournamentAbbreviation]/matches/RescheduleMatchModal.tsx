"use client";
import React, { useRef } from "react";
import { toast } from "sonner";
import { useFormStatus } from "react-dom";
import { Button } from "@ui/atoms/Button/Button";
import Modal from "@ui/organisms/Modal/Modal";
import { Input } from "@ui/atoms/Forms/Input/Input";
import { useTypeSafeFormState } from "@/hooks/useTypeSafeFormState";
import { rescheduleMatchAction } from "@/actions/public/rescheduleMatchAction";
import { rescheduleMatchSchema } from "@/formSchemas/rescheduleMatchSchema";

interface RescheduleMatchModalProps {
	tournamentAbb: string;
	matchId: string;
	currentMatchDate: string;
}

const SubmitButton = ({ onCancel }: { onCancel: () => void }) => {
	const { pending } = useFormStatus();
	return (
		<>
			<Button className="w-max" type={"submit"} disabled={pending}>
				{pending ? (
					<span className="flex items-center gap-2">
						<span className="loading loading-spinner loading-sm"></span>
						Submitting...
					</span>
				) : (
					"Reschedule"
				)}
			</Button>
			<Button
				className="w-max"
				type={"button"}
				onClick={onCancel}
				disabled={pending}
			>
				Cancel
			</Button>
		</>
	);
};

export const RescheduleMatchModal = ({
	tournamentAbb,
	matchId,
	currentMatchDate,
}: RescheduleMatchModalProps) => {
	const modalRef = useRef<HTMLDialogElement>(null);
	const formRef = React.useRef<HTMLFormElement>(null);

	const [state, formAction] = useTypeSafeFormState(
		rescheduleMatchSchema,
		async (data) => {
			const response = await rescheduleMatchAction(data);
			if (!response.status) {
				return toast.error(response.errorMessage, {
					duration: 3000,
				});
			}
			toast.success("Reschedule request sent successfully", {
				duration: 3000,
			});
			modalRef.current?.close();
			formRef.current?.reset();
		},
	);

	return (
		<>
			<Button
				className={"btn btn-ghost btn-xs"}
				onClick={() => modalRef?.current?.showModal()}
				type={"button"}
			>
				Reschedule match
			</Button>

			<Modal ref={modalRef}>
				<h1>Reschedule Match</h1>
				<form action={formAction} ref={formRef} id={"reschedule-match"}>
					<div className={"grid w-full max-w-5xl grid-cols-1 gap-4 rounded-lg p-4"}>
						<Input
							name={"tournamentAbbreviation"}
							label={"Tournament Abbreviation"}
							value={tournamentAbb}
							type={"hidden"}
							required={true}
						/>
						<Input
							name={"matchId"}
							label={"Match ID"}
							value={matchId}
							type={"hidden"}
							required={true}
						/>
						<Input
							name={"proposedDateTime"}
							label={"New Date and Time"}
							type={"datetime-local"}
							errorMessage={
								state?.errors.proposedDateTime && state?.errors.proposedDateTime[0]
							}
							required={true}
							min={currentMatchDate}
						/>
						<label className="label flex max-w-max cursor-pointer">
							<input
								type="checkbox"
								className="checkbox mr-5"
								name={"agreeToRules"}
								required
							/>
							<span className="label-text mr-auto">
								I agree to the reschedule rules
							</span>
						</label>
						{state?.errors.agreeToRules && (
							<p className="text-error">{state.errors.agreeToRules[0]}</p>
						)}
					</div>
					<div className="mt-4 flex gap-2">
						<SubmitButton
							onCancel={() => {
								modalRef.current?.close();
								formRef.current?.reset();
							}}
						/>
					</div>
				</form>
			</Modal>
		</>
	);
};


