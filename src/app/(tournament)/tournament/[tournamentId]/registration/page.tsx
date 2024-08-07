"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@ui/atoms/Button/Button";
import { useTypeSafeFormState } from "@/hooks/useTypeSafeFormState";
import { createTeamSchema } from "@/formSchemas/createTeamSchema";
import { createTeamAction } from "@/actions/public/createTeamAction";
import Section from "@ui/atoms/Section/Section";
import { Input } from "@ui/atoms/Forms/Input/Input";

const SingleTournamentRegistration = ({
	params,
}: {
	params: {
		tournamentId: string;
	};
}) => {
	const formRef = React.useRef<HTMLFormElement>(null);
	const router = useRouter();
	const [_state, formAction] = useTypeSafeFormState(createTeamSchema, async (data) => {
		const teamResponseDto = await createTeamAction(data);
		console.log(teamResponseDto);
		if (!teamResponseDto.status) {
			return toast.error(teamResponseDto.errorMessage, {
				duration: 3000,
			});
		}
		formRef.current?.reset();
		router.push(`/tournament/${params.tournamentId}/registration`);
	});

	// console.log(state, "state");

	return (
		<Section>
			<form id="create-team" className={"flex-col gap-4"} action={formAction} ref={formRef}>
				<div className={"flex flex-col gap-4 "}>
					<div className={"flex"}>
						<div className={"flex flex-col"}>
							<h2 className={"mb-3  text-4xl font-bold leading-relaxed"}>
								Create a team
							</h2>
							<Input
								label={"Enter your team name"}
								required={true}
								type="text"
								name="teamName"
								placeholder="Type here"
							/>
							<Input
								value={params.tournamentId}
								type="hidden"
								name="tournamentAbb"
								label={"Tournament Abbreviation"}
							/>
						</div>
					</div>
					<h2 className={"mb-6 mt-14 w-2/3 text-3xl lg:w-2/4"}>
						To play on this tournament, please agree to our Terms and Conditions
					</h2>
					<div
						className={
							"mb-6 flex w-full flex-col gap-4 rounded-xl bg-tuned p-8 lg:w-3/4"
						}
					>
						<div className={"flex w-full flex-col gap-2"}>
							<h3 className={"text-xl font-bold"}>Topic 1</h3>
							<p className={"text-base"}>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
								malesuada, tortor nec tincidunt tincidunt, libero nunc ullamcorper
								nunc, nec interdum turpis libero a libero. Integer quis ex nec purus
								lacinia ultricies. Nullam auctor, nisl vel ultricies condimentum,
								purus nunc lacinia purus, nec ullamcorper libero ligula nec sapien.
								Nunc id semper nunc, nec ullamcorper libero. Nullam auctor, nisl vel
								ultricies condimentum, purus nunc lacinia purus, nec ullamcorper
								libero ligula nec sapien. Nunc id semper nunc, nec ullamcorper
								libero.
							</p>
						</div>
						<div className={"flex w-full flex-col gap-2"}>
							<h3 className={"text-xl font-bold"}>Topic 2</h3>
							<p className={"text-base"}>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
								malesuada, tortor nec tincidunt tincidunt, libero nunc ullamcorper
								nunc, nec interdum turpis libero a libero. Integer quis ex nec purus
								lacinia ultricies. Nullam auctor, nisl vel ultricies condimentum,
								purus nunc lacinia purus, nec ullamcorper libero ligula nec sapien.
								Nunc id semper nunc, nec ullamcorper libero. Nullam auctor, nisl vel
								ultricies condimentum, purus nunc lacinia purus, nec ullamcorper
								libero ligula nec sapien. Nunc id semper nunc, nec ullamcorper
								libero.
							</p>
						</div>
					</div>

					<div className="form-control">
						<label className="label flex cursor-pointer justify-start gap-4">
							<input
								type="checkbox"
								required={true}
								className="checkbox-success checkbox"
								name="terms"
							/>
							<span className="label-text">
								Me and my team agrees to the Terms and Conditions
							</span>
						</label>
					</div>
				</div>
				<Button className="mt-4 w-max" type={"submit"}>
					Create team
				</Button>
			</form>
		</Section>
	);
};

export default SingleTournamentRegistration;
