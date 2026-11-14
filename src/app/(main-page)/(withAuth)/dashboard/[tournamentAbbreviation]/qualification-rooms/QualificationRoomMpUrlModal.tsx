"use client";

import React, { useRef, useTransition } from "react";
import { toast } from "sonner";
import { setQualificationRoomMpUrlAction } from "@/actions/admin/adminQualificationRoomsActions";
import { Button } from "@ui/atoms/Button/Button";
import Modal from "@ui/organisms/Modal/Modal";
import { Input } from "@ui/atoms/Forms/Input/Input";

export function QualificationRoomMpUrlModal({
	tournamentAbbreviation,
	roomId,
	roomNumber,
	mpUrl,
}: {
	tournamentAbbreviation: string;
	roomId: string;
	roomNumber: number;
	mpUrl?: string | null;
}) {
	const modalRef = useRef<HTMLDialogElement>(null);
	const [isPending, startTransition] = useTransition();

	const save = (value: string) => {
		startTransition(async () => {
			const response = await setQualificationRoomMpUrlAction(tournamentAbbreviation, roomId, value);
			if (response.status) {
				toast.success(value ? "MP link saved." : "MP link removed.", { duration: 2500 });
				modalRef.current?.close();
			} else {
				toast.error(response.errorMessage, { duration: 4000 });
			}
		});
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		save(String(formData.get("mpUrl") ?? "").trim());
	};

	return (
		<>
			<button
				className="btn btn-ghost btn-xs gap-1"
				type="button"
				onClick={() => modalRef.current?.showModal()}
			>
				{mpUrl ? "edit mp link" : "add mp link"}
			</button>

			<Modal ref={modalRef}>
				<h1 className="text-lg font-bold text-white">MP link for room #{roomNumber}</h1>
				<form onSubmit={handleSubmit}>
					<div className="grid grid-cols-1 gap-3 p-4">
						<Input
							label="MP link"
							name="mpUrl"
							required
							placeholder="https://osu.ppy.sh/community/matches/123456789 or 123456789"
							defaultValue={mpUrl ?? ""}
						/>
					</div>
					<div className="mt-2 flex items-center gap-2">
						<Button type="submit" loading={isPending}>
							Save
						</Button>
						{mpUrl && (
							<button
								type="button"
								className="btn btn-ghost btn-sm text-flatRed"
								disabled={isPending}
								onClick={() => save("")}
							>
								Remove link
							</button>
						)}
					</div>
				</form>
			</Modal>
		</>
	);
}
