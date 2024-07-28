"use client";
import React from "react";
import { Button } from "@ui/atoms/Button/Button";
import { useTypeSafeFormState } from "@/hooks/useTypeSafeFormState";
import { createTeamSchema } from "@/app/(tournament)/tournament/[tournamentId]/registration/createTeamSchema";
import { createTeamAction } from "@/actions/createTeamAction";

const SingleTournamentRegistration = ({
	params,
}: {
	params: {
		tournamentId: string;
	};
}) => {
	const formRef = React.useRef<HTMLFormElement>(null);
	const [value, setValue] = React.useState("");
	const [_state, formAction] = useTypeSafeFormState(createTeamSchema, async (data) => {
		const teamResponseDto = await createTeamAction(data);
		console.log(teamResponseDto, "teamResponseDto");
		//const teamResponseDtoAsJson = JSON.parse(teamResponseDto) as TeamResponseDto | ApiError;

		// console.log(teamResponseDtoAsJson);
		formRef.current?.reset();
	});

	// console.log(state, "state");

	return (
		<main className={"text-white container mx-auto"}>
			<form
				id="create-team"
				className={
					"divide-gray-700 md:px-18 my-12 flex w-full flex-col gap-4 px-8 lg:px-20"
				}
				action={formAction}
				ref={formRef}
			>
				<div className={"flex flex-col gap-4 "}>
					<div className={"container mx-auto flex"}>
						<div className={"flex flex-col md:w-full"}>
							<h2 className={"mb-3  text-4xl font-bold leading-relaxed"}>
								Create a team
							</h2>
							<h2 className={"mb-3  text-2xl font-bold leading-relaxed"}>
								Enter your team name
							</h2>
							<input
								onChange={(e) => setValue(e.target.value)}
								value={value}
								required={true}
								type="text"
								name="teamName"
								placeholder="Type here"
								className="input input-bordered w-full max-w-xs focus:border-mintGreen focus:ring-mintGreen"
							/>
							<input
								onChange={() => {
									return;
								}}
								value={params.tournamentId}
								hidden={true}
								type="text"
								name="tournamentAbb"
								placeholder=""
								className="input input-bordered w-full max-w-xs focus:border-mintGreen focus:ring-mintGreen"
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
		</main>
	);
};

export default SingleTournamentRegistration;
