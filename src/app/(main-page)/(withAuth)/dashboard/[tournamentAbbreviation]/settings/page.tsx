"use client";
import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import ReactQuill from "react-quill";
import Image from "next/image";
import { FiSave, FiUpload } from "react-icons/fi";
import { type TournamentResponseDto } from "../../../../../../../client";

type ExtendedTournament = TournamentResponseDto & {
	swissTeams?: number;
	bracketSize?: number;
	numQualifiers?: number;
	playInTeams?: number;
};
import { useTypeSafeFormState } from "@/hooks/useTypeSafeFormState";
import { editTournamentSchema } from "@/formSchemas/editTournamentSchema";
import { Input } from "@ui/atoms/Forms/Input/Input";
import { Button } from "@ui/atoms/Button/Button";
import { SubmitButton } from "@ui/atoms/Button/SubmitButton";
import { Card } from "@ui/atoms/Card/Card";
import { PageHeader } from "@ui/molecules/PageHeader/PageHeader";
import "react-quill/dist/quill.snow.css";
import { editTournamentAction } from "@/actions/admin/editTournamentAction";
import { editTournamentImageAction } from "@/actions/admin/editTournamentImageAction";
import { getTournamentAction } from "@/actions/public/getTournamentAction";

const SettingsPage = () => {
	const [tournamentData, setTournamentData] = React.useState<TournamentResponseDto | null>(null);
	const { tournamentAbbreviation } = useParams<{ tournamentAbbreviation: string }>();
	const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
	const [imagePreview, setImagePreview] = React.useState<string | null>(null);
	const formRef = React.useRef<HTMLFormElement>(null);
	const [rulesError, setRulesError] = React.useState<string | null>(null);
	const [rules, setRules] = React.useState<string>("");
	const router = useRouter();

	const [isUploadingImage, setIsUploadingImage] = React.useState(false);

	const modules = {
		toolbar: [
			[{ header: [1, 2, 3, 4, 5, 6, false] }],
			["bold", "italic", "underline", "strike", "blockquote"],
			[{ align: ["right", "center", "justify"] }],
			[{ list: "ordered" }, { list: "bullet" }],
			["link", "image"],
		],
	};

	const [editTournamentState, editTournamentFormAction] = useTypeSafeFormState(
		editTournamentSchema,
		async (data) => {
			if (!rules) {
				setRulesError("Rules are required");
				return;
			}
			setRulesError(null);
			const editTournamentResponse = await editTournamentAction(data, rules);
			if (!editTournamentResponse.status) {
				return toast.error(editTournamentResponse.errorMessage, {
					duration: 4000,
				});
			}
			toast.success("Tournament edited successfully", {
				duration: 2500,
			});

			router.push(`/dashboard/${data.abbreviation}/settings`);
		},
	);

	useEffect(() => {
		const fetchTournamentData = async () => {
			const result = await getTournamentAction(tournamentAbbreviation);
			if (result.status && result.data) {
				setTournamentData(result.data);
				setRules(result.data.rules || "");
			} else {
				toast.error(result.errorMessage || "Failed to load tournament data", {
					duration: 4000,
				});
			}
		};
		void fetchTournamentData();
	}, [tournamentAbbreviation]);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) {
			setSelectedImage(null);
			setImagePreview(null);
			return;
		}

		setSelectedImage(file);

		// Create preview
		const reader = new FileReader();
		reader.onloadend = () => {
			setImagePreview(reader.result as string);
		};
		reader.readAsDataURL(file);
	};

	const handleImageSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!selectedImage) {
			toast.error("Please select an image", { duration: 4000 });
			return;
		}
		setIsUploadingImage(true);
		try {
			const formData = new FormData();
			formData.append("image", selectedImage);
			formData.append("abbreviation", tournamentAbbreviation);
			const data = await editTournamentImageAction(formData);
			if (!data.status) {
				toast.error(data.errorMessage ?? "Failed to update tournament image", {
					duration: 4000,
				});
			} else {
				toast.success("Tournament image updated successfully", {
					duration: 2500,
				});
				setSelectedImage(null);
				setImagePreview(null);
			}
		} finally {
			setIsUploadingImage(false);
		}
	};

	return (
		<div className="flex w-full flex-col gap-6">
			<PageHeader
				title="Settings"
				subtitle="Manage tournament details, rules, and banner image."
			/>

			{/* Tournament details + rules */}
			<form action={editTournamentFormAction} ref={formRef} id="tournament-settings-form">
				<div className="flex flex-col gap-6">
					<Card title="Tournament details">
						<div className="grid w-full max-w-5xl grid-cols-1 gap-4">
							<Input
								name="oldAbbreviation"
								label="oldAbbreviation"
								value={tournamentAbbreviation}
								type="hidden"
								required={true}
							/>
							<Input
								type="text"
								name="abbreviation"
								label="Tournament abbreviation"
								errorMessage={
									editTournamentState?.errors.abbreviation &&
									editTournamentState?.errors.abbreviation[0]
								}
								required={true}
								value={tournamentData?.abbreviation || ""}
								onChange={(e) => {
									setTournamentData((prev) => ({
										...prev,
										abbreviation: e.target.value,
									} as TournamentResponseDto));
								}}
							/>
							<Input
								name="name"
								label="Tournament name"
								errorMessage={
									editTournamentState?.errors.name && editTournamentState?.errors.name[0]
								}
								required={true}
								value={tournamentData?.name || ""}
								onChange={(e) => {
									setTournamentData((prev) => ({
										...prev,
										name: e.target.value,
									} as TournamentResponseDto));
								}}
							/>
							{(tournamentData?.tournamentType === "TEAM_VS" ||
								tournamentData?.tournamentType === "INTERNATIONAL" ||
								tournamentData?.tournamentType === "AUCTION") && (
								<>
									<Input
										name="matchSize"
										label="Match size (e.g. 4 for 4v4)"
										type="number"
										value={String(tournamentData?.matchSize || "")}
										onChange={(e) => {
											setTournamentData((prev) => ({
												...prev,
												matchSize: e.target.value ? Number(e.target.value) : undefined,
											} as TournamentResponseDto));
										}}
									/>
									<Input
										name="swissTeams"
										label="Swiss stage team count"
										type="number"
										value={String((tournamentData as ExtendedTournament)?.swissTeams || "")}
										onChange={(e) => {
											setTournamentData((prev) => ({
												...prev,
												swissTeams: e.target.value ? Number(e.target.value) : undefined,
											} as ExtendedTournament));
										}}
									/>
									<Input
										name="bracketSize"
										label="DE bracket size (8, 16, or 32)"
										type="number"
										value={String((tournamentData as ExtendedTournament)?.bracketSize || "")}
										onChange={(e) => {
											setTournamentData((prev) => ({
												...prev,
												bracketSize: e.target.value ? Number(e.target.value) : undefined,
											} as ExtendedTournament));
										}}
									/>
									<Input
										name="numQualifiers"
										label="Direct seeds (teams advancing straight to DE, e.g. 7)"
										type="number"
										value={String((tournamentData as ExtendedTournament)?.numQualifiers || "")}
										onChange={(e) => {
											setTournamentData((prev) => ({
												...prev,
												numQualifiers: e.target.value ? Number(e.target.value) : undefined,
											} as ExtendedTournament));
										}}
									/>
									<Input
										name="playInTeams"
										label="Play-In teams (bubble teams in SE bracket, e.g. 6)"
										type="number"
										value={String((tournamentData as ExtendedTournament)?.playInTeams || "")}
										onChange={(e) => {
											setTournamentData((prev) => ({
												...prev,
												playInTeams: e.target.value ? Number(e.target.value) : undefined,
											} as ExtendedTournament));
										}}
									/>
								</>
							)}
						</div>
					</Card>

					<Card title="Prize pool">
						<div className="grid grid-cols-3 gap-4">
							<Input
								label="Prize for 1st place"
								name="prize0"
								type="number"
								value={
									tournamentData?.prizePool && tournamentData?.prizePool[0]?.prize
										? String(tournamentData.prizePool[0].prize)
										: ""
								}
								onChange={(e) => {
									const prize = e.target.value ? Number(e.target.value) : undefined;
									setTournamentData((prev) => {
										const prizePool = [...(prev?.prizePool || [])];
										if (prizePool[0]) {
											prizePool[0] = { ...prizePool[0], prize: String(prize || 0) };
										} else {
											prizePool[0] = { type: 0, prize: String(prize || 0) };
										}
										return {
											...prev,
											prizePool,
										} as TournamentResponseDto;
									});
								}}
								errorMessage={
									editTournamentState?.errors.prize0 &&
									editTournamentState?.errors.prize0[0]
								}
							/>
							<Input
								label="Prize for 2nd place"
								name="prize1"
								type="number"
								value={
									tournamentData?.prizePool && tournamentData?.prizePool[1]?.prize
										? String(tournamentData.prizePool[1].prize)
										: ""
								}
								onChange={(e) => {
									const prize = e.target.value ? Number(e.target.value) : undefined;
									setTournamentData((prev) => {
										const prizePool = [...(prev?.prizePool || [])];
										if (prizePool[1]) {
											prizePool[1] = { ...prizePool[1], prize: String(prize || 0) };
										} else {
											prizePool[1] = { type: 1, prize: String(prize || 0) };
										}
										return {
											...prev,
											prizePool,
										} as TournamentResponseDto;
									});
								}}
								errorMessage={
									editTournamentState?.errors.prize1 &&
									editTournamentState?.errors.prize1[0]
								}
							/>
							<Input
								label="Prize for 3rd place"
								name="prize2"
								type="number"
								value={
									tournamentData?.prizePool && tournamentData?.prizePool[2]?.prize
										? String(tournamentData.prizePool[2].prize)
										: ""
								}
								onChange={(e) => {
									const prize = e.target.value ? Number(e.target.value) : undefined;
									setTournamentData((prev) => {
										const prizePool = [...(prev?.prizePool || [])];
										if (prizePool[2]) {
											prizePool[2] = { ...prizePool[2], prize: String(prize || 0) };
										} else {
											prizePool[2] = { type: 2, prize: String(prize || 0) };
										}
										return {
											...prev,
											prizePool,
										} as TournamentResponseDto;
									});
								}}
								errorMessage={
									editTournamentState?.errors.prize2 &&
									editTournamentState?.errors.prize2[0]
								}
							/>
						</div>
					</Card>

					<Card title="Rules">
						<ReactQuill
							modules={modules}
							value={rules}
							onChange={(value) => {
								setRules(value);
								setRulesError(null);
							}}
						/>
						{rulesError && (
							<div className="mt-1 h-4 truncate text-xs font-bold text-flatRed">
								{rulesError}
							</div>
						)}
					</Card>

					<div>
						<SubmitButton className="gap-2 rounded-md bg-deepRed px-6 py-2 text-white hover:opacity-80 disabled:opacity-50">
							<FiSave />
							Save tournament settings
						</SubmitButton>
					</div>
				</div>
			</form>

			{/* Banner image */}
			<form onSubmit={handleImageSubmit}>
				<Card title="Banner image">
					<div className="flex flex-col gap-4">
						<div className="flex flex-col gap-2">
							<label className="label">
								<span className="label-text">Tournament banner (.jpg / .jpeg / .png)</span>
							</label>
							<input
								type="file"
								name="image"
								accept=".jpg,.jpeg,.png"
								onChange={handleImageChange}
								className="file-input file-input-bordered w-full"
							/>
						</div>
						{imagePreview && (
							<div className="flex items-center gap-2">
								<span className="text-sm text-white/40">Preview:</span>
								<div className="relative h-32 w-64">
									<Image
										src={imagePreview}
										alt="Tournament image preview"
										fill
										className="rounded object-cover"
									/>
								</div>
							</div>
						)}
						{tournamentData && !imagePreview && (
							<div className="flex items-center gap-2">
								<span className="text-sm text-white/40">Current image:</span>
								<div className="relative h-32 w-64">
									<Image
										src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/tournaments/${tournamentAbbreviation}/banner`}
										alt="Current tournament image"
										fill
										className="rounded object-cover"
										unoptimized
									/>
								</div>
							</div>
						)}
						<div>
							<Button
								type="submit"
								loading={isUploadingImage}
								className="gap-2"
							>
								<FiUpload />
								Upload banner
							</Button>
						</div>
					</div>
				</Card>
			</form>
		</div>
	);
};

export default SettingsPage;
