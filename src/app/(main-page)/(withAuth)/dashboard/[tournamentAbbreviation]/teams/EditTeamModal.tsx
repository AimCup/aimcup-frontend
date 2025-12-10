"use client";

import React, { useRef, useState, useMemo } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { TeamResponseDto, ParticipantResponseDto } from "../../../../../../../client";
import { RemoveParticipantModal } from "./RemoveParticipantModal";
import { Button } from "@ui/atoms/Button/Button";
import Modal from "@ui/organisms/Modal/Modal";
import { Input } from "@ui/atoms/Forms/Input/Input";
import { useTypeSafeFormState } from "@/hooks/useTypeSafeFormState";
import { updateTeamSchema } from "@/formSchemas/updateTeamSchema";
import {
	updateTeamAction,
	addParticipantAction,
	removeParticipantAction,
	changeCaptainAction,
} from "@/actions/admin/adminTeamActions";

interface IEditTeamModalProps {
	tournamentAbb: string;
	team: TeamResponseDto;
}

export const EditTeamModal = ({ tournamentAbb, team }: IEditTeamModalProps) => {
	const modalRef = useRef<HTMLDialogElement>(null);
	const formRef = useRef<HTMLFormElement>(null);
	const router = useRouter();
	const [participants, setParticipants] = useState<ParticipantResponseDto[]>(team.participants);
	const [captain, setCaptain] = useState<ParticipantResponseDto>(team.captain);
	const [osuIdToAdd, setOsuIdToAdd] = useState<string>("");
	const [isAddingParticipant, setIsAddingParticipant] = useState(false);
	const [isRemovingParticipant, setIsRemovingParticipant] = useState<string | null>(null);
	const [isChangingCaptain, setIsChangingCaptain] = useState<string | null>(null);
	const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
	const [logoPreview, setLogoPreview] = useState<string | null>(null);
	const [logoError, setLogoError] = useState<string | null>(null);
	
	// Create refs for remove participant modals
	const removeModalRefs = useMemo(() => {
		const refs: Record<string, React.RefObject<HTMLDialogElement>> = {};
		participants.forEach((participant) => {
			if (participant.id !== captain.id) {
				refs[participant.id] = React.createRef<HTMLDialogElement>();
			}
		});
		return refs;
	}, [participants, captain.id]);

	const validateLogo = (file: File): Promise<string | null> => {
		return new Promise((resolve) => {
			// Check file size (max 2MB)
			if (file.size > 2 * 1024 * 1024) {
				resolve("Image size cannot exceed 2MB");
				return;
			}

			// Check file extension
			const allowedExtensions = [".jpg", ".jpeg", ".png"];
			const fileName = file.name.toLowerCase();
			const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
			if (!hasValidExtension) {
				resolve("Image must be in format: jpg, jpeg, or png");
				return;
			}

			// Check image dimensions
			const img = new window.Image();
			const objectUrl = URL.createObjectURL(file);
			img.onload = () => {
				URL.revokeObjectURL(objectUrl);
				if (img.width > 50 || img.height > 50) {
					resolve("Image dimensions cannot exceed 50x50 pixels");
				} else {
					resolve(null);
				}
			};
			img.onerror = () => {
				URL.revokeObjectURL(objectUrl);
				resolve("Invalid image file");
			};
			img.src = objectUrl;
		});
	};

	const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) {
			setSelectedLogo(null);
			setLogoPreview(null);
			setLogoError(null);
			return;
		}

		setLogoError(null);

		// Validate file
		const error = await validateLogo(file);
		if (error) {
			setLogoError(error);
			setSelectedLogo(null);
			setLogoPreview(null);
			e.target.value = "";
			return;
		}

		setSelectedLogo(file);

		// Create preview
		const reader = new FileReader();
		reader.onloadend = () => {
			setLogoPreview(reader.result as string);
		};
		reader.readAsDataURL(file);
	};

	const [state, formAction] = useTypeSafeFormState(updateTeamSchema, async (data) => {
		// Create FormData from form data and logo file
		const formDataToSend = new FormData();
		formDataToSend.append("tournamentAbbreviation", data.tournamentAbbreviation);
		formDataToSend.append("teamId", data.teamId);
		formDataToSend.append("name", data.name);
		if (selectedLogo) {
			formDataToSend.append("logo", selectedLogo);
		}

		const updateTeamResponse = await updateTeamAction(formDataToSend);
		if (!updateTeamResponse.status) {
			const errorMsg: string = updateTeamResponse.errorMessage || "Failed to update team";
			return toast.error(errorMsg, {
				duration: 3000,
			});
		}
		toast.success("Team updated successfully", {
			duration: 3000,
		});
		setSelectedLogo(null);
		setLogoPreview(null);
		setLogoError(null);
		modalRef.current?.close();
		router.refresh();
	});

	const handleAddParticipant = async () => {
		if (!osuIdToAdd.trim()) {
			toast.error("Please enter an osu! ID", {
				duration: 3000,
			});
			return;
		}

		setIsAddingParticipant(true);
		const result = await addParticipantAction(tournamentAbb, team.id, osuIdToAdd.trim());
		setIsAddingParticipant(false);

		if (!result.status) {
			const errorMsg: string = result.errorMessage || "Failed to add participant";
			toast.error(errorMsg, {
				duration: 3000,
			});
			return;
		}

		// Update local state with returned team data
		if (result.team) {
			setParticipants(result.team.participants || []);
			if (result.team.captain) {
				setCaptain(result.team.captain);
			}
		}

		toast.success("Participant added successfully", {
			duration: 3000,
		});
		setOsuIdToAdd("");
		router.refresh();
	};

	const handleRemoveParticipant = async (participant: ParticipantResponseDto) => {
		if (participant.id === captain.id) {
			toast.error("Cannot remove team captain. Change captain first.", {
				duration: 3000,
			});
			return;
		}

		setIsRemovingParticipant(participant.id);
		const result = await removeParticipantAction(
			tournamentAbb,
			team.id,
			participant.user.osuId.toString(),
		);
		setIsRemovingParticipant(null);

		if (!result.status) {
			const errorMsg: string = result.errorMessage || "Failed to remove participant";
			toast.error(errorMsg, {
				duration: 3000,
			});
			return;
		}

		// Update local state with returned team data
		if (result.team) {
			setParticipants(result.team.participants || []);
			if (result.team.captain) {
				setCaptain(result.team.captain);
			}
		}

		toast.success("Participant removed successfully", {
			duration: 3000,
		});
		router.refresh();
	};

	const handleChangeCaptain = async (participant: ParticipantResponseDto) => {
		if (participant.id === captain.id) {
			return;
		}

		setIsChangingCaptain(participant.id);
		const result = await changeCaptainAction(
			tournamentAbb,
			team.id,
			participant.user.osuId.toString(),
		);
		setIsChangingCaptain(null);

		if (!result.status) {
			const errorMsg: string = result.errorMessage || "Failed to change captain";
			toast.error(errorMsg, {
				duration: 3000,
			});
			return;
		}

		// Update local state with returned team data
		if (result.team) {
			setParticipants(result.team.participants || []);
			if (result.team.captain) {
				setCaptain(result.team.captain);
			}
		}

		toast.success("Captain changed successfully", {
			duration: 3000,
		});
		router.refresh();
	};

	return (
		<>
			<button
				className={"btn btn-ghost btn-xs"}
				onClick={() => modalRef?.current?.showModal()}
				type={"button"}
			>
				EDIT
			</button>

			<Modal ref={modalRef}>
				<h1 className="mb-4 text-2xl font-bold">Edit Team: {team.name}</h1>
				<form action={formAction} ref={formRef} id={"edit-team"} onSubmit={(e) => e.stopPropagation()}>
					<div className={"grid w-full max-w-5xl grid-cols-1 gap-4 rounded-lg p-4"}>
						<Input
							name={"tournamentAbbreviation"}
							label={"Tournament Abbreviation"}
							value={tournamentAbb}
							type={"hidden"}
							required={true}
						/>
						<Input
							name={"teamId"}
							label={"Team ID"}
							value={team.id}
							type={"hidden"}
							required={true}
						/>

						{/* Team Name */}
						<Input
							type={"text"}
							name={"name"}
							label={"Team Name"}
							defaultValue={team.name}
							errorMessage={state?.errors.name && state?.errors.name[0]}
							required={true}
						/>

						{/* Team Logo */}
						<div className="flex flex-col gap-2">
							<label className="label">
								<span className="label-text">Team Logo (max 50x50px, 2MB, jpg/jpeg/png)</span>
							</label>
							<input
								type={"file"}
								name={"logo"}
								accept=".jpg,.jpeg,.png"
								onChange={handleLogoChange}
								className="file-input file-input-bordered w-full"
							/>
							{logoError && (
								<div className="text-sm font-bold text-flatRed">{logoError}</div>
							)}
							{(logoPreview || (team.logoUrl && !selectedLogo && team.logoUrl !== "/aim_logo.svg")) && (
								<div className="flex items-center gap-2">
									<span className="text-sm text-gray-600">Preview:</span>
									<div className="avatar">
										<div className="mask mask-squircle h-12 w-12">
											<Image
												src={logoPreview || (team.logoUrl.startsWith("/api/teams/") ? `${process.env.NEXT_PUBLIC_API_URL || ""}${team.logoUrl}` : team.logoUrl) || "/aim_logo.svg"}
												alt="Team logo"
												width={48}
												height={48}
											/>
										</div>
									</div>
								</div>
							)}
						</div>

						{/* Participants Management */}
						<div className="divider">Participants</div>

						{/* Add Participant */}
						<div className="flex gap-2 mb-4">
							<Input
								type={"text"}
								name={"osuId"}
								label={"Add Participant (osu! ID)"}
								value={osuIdToAdd}
								onChange={(e) => setOsuIdToAdd(e.target.value)}
								placeholder="Enter osu! ID"
							/>
							<Button
								type="button"
								onClick={handleAddParticipant}
								disabled={isAddingParticipant}
								className="self-end"
							>
								{isAddingParticipant ? "Adding..." : "Add"}
							</Button>
						</div>

						{/* Participants Table */}
						<div className="overflow-x-auto">
							<table className="table w-full">
								<thead>
									<tr>
										<th>Avatar</th>
										<th>Username</th>
										<th>osu! ID</th>
										<th>Status</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{participants.map((participant) => (
										<tr key={participant.id}>
											<td>
												<div className="avatar">
													<div className="mask mask-squircle h-10 w-10">
														<Image
															src={`https://a.ppy.sh/${participant.user.osuId}`}
															alt={participant.user.username}
															width={40}
															height={40}
														/>
													</div>
												</div>
											</td>
											<td>
												<div className="font-semibold">{participant.user.username}</div>
											</td>
											<td>
												<div className="text-sm text-gray-500">{participant.user.osuId}</div>
											</td>
											<td>
												{participant.id === captain.id ? (
													<span className="badge badge-primary">Captain</span>
												) : (
													<span className="text-sm text-gray-400">Member</span>
												)}
											</td>
											<td>
												<div className="flex gap-2">
													{participant.id !== captain.id ? (
														<>
															<button
																type="button"
																className="btn btn-sm btn-error"
																onClick={() => {
																	removeModalRefs[participant.id]?.current?.showModal();
																}}
																disabled={isRemovingParticipant === participant.id}
															>
																{isRemovingParticipant === participant.id
																	? "Removing..."
																	: "Remove"}
															</button>
															<button
																type="button"
																className="btn btn-sm btn-outline"
																onClick={() => handleChangeCaptain(participant)}
																disabled={isChangingCaptain === participant.id}
															>
																{isChangingCaptain === participant.id
																	? "Changing..."
																	: "Make captain"}
															</button>
														</>
													) : (
														<span className="text-sm text-gray-400 italic">
															Captain cannot be removed
														</span>
													)}
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
				</div>
				<div className="mt-4 flex gap-2">
					<Button type={"submit"}>Update Team</Button>
					<Button
						type="button"
						onClick={() => modalRef.current?.close()}
						className="btn-outline"
					>
						Cancel
					</Button>
				</div>
			</form>
			</Modal>
			
			{/* Render remove participant modals outside the main modal to avoid nested forms */}
			{participants.map((participant) => (
				participant.id !== captain.id && removeModalRefs[participant.id] && (
					<RemoveParticipantModal
						key={`remove-modal-${participant.id}`}
						modalRef={removeModalRefs[participant.id]}
						participant={participant}
						onConfirm={() => handleRemoveParticipant(participant)}
						isRemoving={isRemovingParticipant === participant.id}
					/>
				)
			))}
		</>
	);
};

