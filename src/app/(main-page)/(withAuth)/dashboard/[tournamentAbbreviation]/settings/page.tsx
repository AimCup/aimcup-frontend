"use client";
import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import ReactQuill from "react-quill";
import { type TournamentResponseDto, TournamentService } from "../../../../../../../generated";
import Section from "@ui/atoms/Section/Section";
import { useTypeSafeFormState } from "@/hooks/useTypeSafeFormState";
import { editTournamentSchema } from "@/formSchemas/editTournamentSchema";
import { Input } from "@ui/atoms/Forms/Input/Input";
import { Button } from "@ui/atoms/Button/Button";
import "react-quill/dist/quill.snow.css";
import { editTournamentAction } from "@/actions/admin/editTournamentAction";

const SettingsPage = () => {
	const [tournamentData, setTournamentData] = React.useState<TournamentResponseDto | null>(null);
	const { tournamentAbbreviation } = useParams<{ tournamentAbbreviation: string }>();
	const formRef = React.useRef<HTMLFormElement>(null);
	const [rulesError, setRulesError] = React.useState<string | null>(null);
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
			if (!tournamentData?.rules) {
				setRulesError("Rules are required");
				return;
			}
			const editTournamentResponse = await editTournamentAction(data, tournamentData?.rules);
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
			const tournamentData =
				await TournamentService.getTournamentByAbbreviation(tournamentAbbreviation);
			setTournamentData(tournamentData);
			// console.log(tournamentData);
		};
		void fetchTournamentData();
	}, [tournamentAbbreviation]);

	return (
		<Section className={"flex-col !py-0"}>
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
						defaultValue={tournamentData?.abbreviation}
					/>
					<Input
						name={"name"}
						label={"Tournament name"}
						errorMessage={
							editTournamentState?.errors.name && editTournamentState?.errors.name[0]
						}
						required={true}
						defaultValue={tournamentData?.name}
					/>
					<h3 className={"mb-3  text-xl font-bold leading-relaxed"}>Prize pool</h3>
					<div className="grid grid-cols-3 gap-4">
						<Input
							label={"Prize for 1st place"}
							name={"prize0"}
							defaultValue={
								tournamentData?.prizePool && tournamentData?.prizePool[0]?.prize
							}
							errorMessage={
								editTournamentState?.errors.prize0 &&
								editTournamentState?.errors.prize0[0]
							}
						/>
						<Input
							label={"Prize for 2nd place"}
							name={"prize1"}
							defaultValue={
								tournamentData?.prizePool && tournamentData?.prizePool[1]?.prize
							}
							errorMessage={
								editTournamentState?.errors.prize1 &&
								editTournamentState?.errors.prize1[0]
							}
						/>
						<Input
							label={"Prize for 3rd place"}
							name={"prize2"}
							defaultValue={
								tournamentData?.prizePool && tournamentData?.prizePool[2]?.prize
							}
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
					value={tournamentData?.rules || ""}
					onChange={(value) => {
						setTournamentData((prevState) => {
							return {
								...prevState,
								rules: value,
							} as TournamentResponseDto;
						});
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
		</Section>
	);
};

export default SettingsPage;
