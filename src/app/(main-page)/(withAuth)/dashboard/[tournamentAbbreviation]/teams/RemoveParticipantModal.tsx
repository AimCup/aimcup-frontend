"use client";

import React from "react";
import type { ParticipantResponseDto } from "../../../../../../../client";
import { Button } from "@ui/atoms/Button/Button";
import Modal from "@ui/organisms/Modal/Modal";

interface IRemoveParticipantModalProps {
	modalRef: React.RefObject<HTMLDialogElement>;
	participant: ParticipantResponseDto;
	onConfirm: () => Promise<void>;
	isRemoving?: boolean;
}

export const RemoveParticipantModal = ({
	modalRef,
	participant,
	onConfirm,
	isRemoving = false,
}: IRemoveParticipantModalProps) => {

	const handleConfirmRemove = async () => {
		try {
			await onConfirm();
			modalRef.current?.close();
		} catch (error) {
			// Error handling is done in parent component
		}
	};

	const handleCancel = () => {
		modalRef.current?.close();
	};

	return (
		<Modal ref={modalRef}>
			<h1 className="mb-4 text-2xl font-bold text-error">Remove Participant</h1>
			<div className="space-y-4">
				<p className="text-lg">
					Are you sure you want to remove <strong>&quot;{participant.user.username}&quot;</strong> from
					the team?
				</p>
				<div className="rounded-lg bg-error/10 p-4">
					<p className="font-semibold text-error">Warning:</p>
					<p className="text-sm">
						This action will permanently remove the participant from the team and delete
						their participation data.
					</p>
					<p className="mt-2 text-sm font-semibold">This action cannot be undone.</p>
				</div>
				<div className="flex gap-2">
					<Button
						type="button"
						onClick={handleConfirmRemove}
						disabled={isRemoving}
						className="btn-error"
					>
						{isRemoving ? "Removing..." : "Yes, Remove Participant"}
					</Button>
					<Button
						type="button"
						onClick={handleCancel}
						className="btn-outline"
						disabled={isRemoving}
					>
						Cancel
					</Button>
				</div>
			</div>
		</Modal>
	);
};

