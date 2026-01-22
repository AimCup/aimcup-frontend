"use client";

import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@ui/atoms/Button/Button";
import Modal from "@ui/organisms/Modal/Modal";
import { deleteTeamAction } from "@/actions/admin/adminTeamActions";

interface IDeleteTeamModalProps {
	tournamentAbb: string;
	teamId: string;
	teamName: string;
}

export const DeleteTeamModal = ({
	tournamentAbb,
	teamId,
	teamName,
}: IDeleteTeamModalProps) => {
	const modalRef = useRef<HTMLDialogElement>(null);
	const router = useRouter();
	const [isDeleting, setIsDeleting] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);

	const handleDeleteClick = () => {
		setShowConfirm(true);
	};

	const handleConfirmDelete = async () => {
		setIsDeleting(true);

		const result = await deleteTeamAction(tournamentAbb, teamId);
		setIsDeleting(false);

		if (!result.status) {
			const errorMsg: string = result.errorMessage || "Failed to delete team";
			toast.error(errorMsg, {
				duration: 3000,
			});
			setShowConfirm(false);
			return;
		}

		toast.success("Team deleted successfully", {
			duration: 3000,
		});
		modalRef.current?.close();
		setShowConfirm(false);
		router.refresh();
	};

	const handleCancel = () => {
		setShowConfirm(false);
		modalRef.current?.close();
	};

	return (
		<>
			<button
				className={"btn btn-ghost btn-xs btn-error"}
				onClick={() => modalRef?.current?.showModal()}
				type={"button"}
				disabled={isDeleting}
			>
				{isDeleting ? "Deleting..." : "DELETE"}
			</button>

			<Modal ref={modalRef}>
				<h1 className="mb-4 text-2xl font-bold text-error">
					{showConfirm ? "Confirm Deletion" : "Delete Team"}
				</h1>
				<div className="space-y-4">
					{!showConfirm ? (
						<>
							<p className="text-lg">
								Are you sure you want to delete the team <strong>&quot;{teamName}&quot;</strong>?
							</p>
							<div className="rounded-lg bg-error/10 p-4">
								<p className="font-semibold text-error">Warning:</p>
								<p className="text-sm">
									This action will permanently delete all associated tournament data
									including:
								</p>
								<ul className="mt-2 list-inside list-disc text-sm">
									<li>All matches involving this team</li>
									<li>All match results</li>
									<li>All participants in this team</li>
									<li>All related tournament data</li>
								</ul>
								<p className="mt-2 text-sm font-semibold">
									This action cannot be undone.
								</p>
							</div>
							<div className="flex gap-2">
								<Button
									type="button"
									onClick={handleDeleteClick}
									disabled={isDeleting}
									className="btn-error"
								>
									Continue
								</Button>
								<Button
									type="button"
									onClick={() => modalRef.current?.close()}
									className="btn-outline"
									disabled={isDeleting}
								>
									Cancel
								</Button>
							</div>
						</>
					) : (
						<>
							<p className="text-lg">
								Are you absolutely sure you want to delete the team{" "}
								<strong>&quot;{teamName}&quot;</strong>?
							</p>
							<p className="text-sm text-gray-600">
								This will permanently delete all associated data. This action cannot be
								undone.
							</p>
							<div className="flex gap-2">
								<Button
									type="button"
									onClick={handleConfirmDelete}
									disabled={isDeleting}
									className="btn-error"
								>
									{isDeleting ? "Deleting..." : "Yes, Delete Team"}
								</Button>
								<Button
									type="button"
									onClick={handleCancel}
									className="btn-outline"
									disabled={isDeleting}
								>
									Cancel
								</Button>
							</div>
						</>
					)}
				</div>
			</Modal>
		</>
	);
};

