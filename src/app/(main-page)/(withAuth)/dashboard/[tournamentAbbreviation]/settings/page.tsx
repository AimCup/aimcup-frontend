"use client";
import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import ReactQuill from "react-quill";
import Image from "next/image";
import { type TournamentResponseDto } from "../../../../../../../client";
import { useTypeSafeFormState } from "@/hooks/useTypeSafeFormState";
import { editTournamentSchema } from "@/formSchemas/editTournamentSchema";
import { Input } from "@ui/atoms/Forms/Input/Input";
import { Button } from "@ui/atoms/Button/Button";
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
					duration: 3000,
				});
			}
			toast.success("Tournament edited successfully", {
				duration: 3000,
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
					duration: 3000,
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

	return (
		<div className={"flex w-full flex-col !px-3 !py-2"}>
			<h2 className={"mb-3  text-3xl font-bold leading-relaxed"}>Settings</h2>
			<form action={editTournamentFormAction} ref={formRef} id={"tournament-settings-form"}>
				<div className={"grid w-full max-w-5xl grid-cols-1 gap-4 rounded-lg p-4"}>
					<Input
						name={"oldAbbreviation"}
						label={"oldAbbreviation"}
						value={tournamentAbbreviation}
						type={"hidden"}
						required={true}
					/>
					<Input
						type={"text"}
						name={"abbreviation"}
						label={"Tournament abbreviation"}
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
						name={"name"}
						label={"Tournament name"}
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
					<h3 className={"mb-3  text-xl font-bold leading-relaxed"}>Prize pool</h3>
					<div className="grid grid-cols-3 gap-4">
						<Input
							label={"Prize for 1st place"}
							name={"prize0"}
							type={"number"}
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
										prizePool[0] = { ...prizePool[0], prize: prize || 0 };
									} else {
										prizePool[0] = { type: 0, prize: prize || 0 };
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
							label={"Prize for 2nd place"}
							name={"prize1"}
							type={"number"}
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
										prizePool[1] = { ...prizePool[1], prize: prize || 0 };
									} else {
										prizePool[1] = { type: 1, prize: prize || 0 };
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
							label={"Prize for 3rd place"}
							name={"prize2"}
							type={"number"}
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
										prizePool[2] = { ...prizePool[2], prize: prize || 0 };
									} else {
										prizePool[2] = { type: 2, prize: prize || 0 };
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
				</div>
				<h3 className={"mb-3  text-xl font-bold leading-relaxed"}>Rules</h3>
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
				<Button className="mt-10 w-max" type={"submit"}>
					Edit tournament data
				</Button>
			</form>
			<form
				action={async (formData) => {
					if (!selectedImage) {
						return toast.error("Please select an image", {
							duration: 3000,
						});
					}
					formData.append("image", selectedImage);
					const data = await editTournamentImageAction(formData);
					if (!data.status) {
						return toast.error("Failed to update tournament image", {
							duration: 3000,
						});
					} else {
						toast.success("Tournament image updated successfully", {
							duration: 3000,
						});
						setSelectedImage(null);
						setImagePreview(null);
					}
				}}
			>
				<Input
					name={"abbreviation"}
					label={"abbreviation"}
					value={tournamentAbbreviation}
					type={"hidden"}
					required
				/>
				<div className="mt-10 flex flex-col gap-2">
					<label className="label">
						<span className="label-text">Tournament Image</span>
					</label>
					<input
						type={"file"}
						name={"image"}
						accept=".jpg,.jpeg,.png"
						onChange={handleImageChange}
						className="file-input file-input-bordered w-full"
					/>
					{imagePreview && (
						<div className="flex items-center gap-2">
							<span className="text-sm text-gray-600">Preview:</span>
							<div className="relative h-32 w-64">
								<Image
									src={imagePreview}
									alt="Tournament image preview"
									fill
									className="object-cover rounded"
								/>
							</div>
						</div>
					)}
					{tournamentData && !imagePreview && (
						<div className="flex items-center gap-2">
							<span className="text-sm text-gray-600">Current image:</span>
							<div className="relative h-32 w-64">
								<Image
									src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/tournaments/${tournamentAbbreviation}/banner`}
									alt="Current tournament image"
									fill
									className="object-cover rounded"
									unoptimized
								/>
							</div>
						</div>
					)}
				</div>
				<Button className="mt-10 w-max" type={"submit"}>
					Edit tournament image
				</Button>
			</form>
		</div>
	);
};

export default SettingsPage;
