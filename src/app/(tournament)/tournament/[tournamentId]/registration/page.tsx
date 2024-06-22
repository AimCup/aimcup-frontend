import React from "react";
import Select from "@ui/molecules/Forms/Select/Select";
import { Button } from "@ui/atoms/Button/Button";

const SingleTournamentRegistration = async () => {
	return (
		<main className={"text-white container mx-auto"}>
			<section
				id="registraion"
				className={
					"divide-gray-700 md:px-18 my-12 flex w-full flex-col gap-4 px-8 lg:px-20"
				}
			>
				<div className={"mb-10 flex"}>
					<div className={"flex flex-col gap-4 md:flex-row md:items-center"}>
						<h2 className={"text-4xl font-bold "}>Registration</h2>
					</div>
				</div>

				<div className={"flex flex-col gap-4 "}>
					<h2 className={"text-3xl "}>Choose your team</h2>
					<Select
						options={[
							{
								label: "Team 1",
								value: "team1",
							},
							{
								label: "Team 2",
								value: "team2",
							},
							{
								label: "Team 3",
								value: "team3",
							},
							{
								label: "Team 4",
								value: "team4",
							},
						]}
					/>
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
								defaultChecked
								className="checkbox-success checkbox"
							/>
							<span className="label-text">
								Me and my team agrees to the Terms and Conditions
							</span>
						</label>
					</div>
				</div>
				<Button className={"md:max-w-min"}>Register</Button>
			</section>
		</main>
	);
};

export default SingleTournamentRegistration;
