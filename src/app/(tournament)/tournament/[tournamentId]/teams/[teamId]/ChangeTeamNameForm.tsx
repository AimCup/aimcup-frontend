"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@ui/atoms/Forms/Input/Input";
import { Button } from "@ui/atoms/Button/Button";
import { useTypeSafeFormState } from "@/hooks/useTypeSafeFormState";
import { updateTeamSchema } from "@/formSchemas/updateTeamSchema";
import { updateTeamAction } from "@/actions/public/createTeamAction";

export const ChangeTeamNameForm = ({
	team: { teamId, teamName, logoUrl, tournamentAbbreviation },
	isRegistrationStage,
}: {
	team: {
		tournamentAbbreviation: string;
		teamId: string;
		teamName: string;
		logoUrl: string;
	};
	isRegistrationStage: boolean;
}) => {
	const router = useRouter();
	const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
	const [logoPreview, setLogoPreview] = useState<string | null>(null);
	const [logoError, setLogoError] = useState<string | null>(null);

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

	const [stateChangeTeamProperties, changeTeamPropertiesFormAction] = useTypeSafeFormState(
		updateTeamSchema,
		async (data) => {
			if (!isRegistrationStage) {
				return toast.error("You can only update team information during the registration stage.", {
					duration: 3000,
				});
			}

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
				return toast.error(updateTeamResponse.errorMessage || "Failed to update team", {
					duration: 3000,
				});
			}
			toast.success("Team updated successfully", {
				duration: 3000,
			});
			setSelectedLogo(null);
			setLogoPreview(null);
			setLogoError(null);
			router.refresh();
		},
	);

	if (!isRegistrationStage) {
		return (
			<div className="rounded-lg bg-warning p-4 text-warning-content">
				<p>Team editing is only available during the registration stage.</p>
			</div>
		);
	}

	return (
		<form
			className={"flex flex-col gap-4 md:flex-row md:items-center"}
			action={changeTeamPropertiesFormAction}
		>
			<Input
				name={"name"}
				label={"Team name"}
				placeholder={"team name"}
				errorMessage={
					stateChangeTeamProperties?.errors.name &&
					stateChangeTeamProperties.errors?.name[0]
				}
				defaultValue={teamName}
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
				{(logoPreview || (logoUrl && !selectedLogo && logoUrl !== "/aim_logo.svg")) && (
					<div className="flex items-center gap-2">
						<span className="text-sm text-gray-600">Preview:</span>
						<div className="avatar">
							<div className="mask mask-squircle h-12 w-12">
								<Image
									src={logoPreview || (logoUrl.startsWith("/api/teams/") ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}${logoUrl}` : logoUrl) || "/aim_logo.svg"}
									alt="Team logo"
									width={48}
									height={48}
									unoptimized={logoUrl?.startsWith("/api/teams/")}
								/>
							</div>
						</div>
					</div>
				)}
			</div>

			<Button className={"mt-4"} type={"submit"}>
				Update
			</Button>
			<Input name={"teamId"} label={"teamId"} value={teamId} type={"hidden"} />
			<Input
				type={"hidden"}
				name={"tournamentAbbreviation"}
				label={"tournamentAbbreviation"}
				value={tournamentAbbreviation}
			/>
		</form>
	);
};
