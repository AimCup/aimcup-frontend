import { Button } from "@ui/atoms/Button/Button";

const CreateTeamPage = async ({
	params,
}: {
	params: {
		tournamentId: string;
	};
}) => {
	return (
		<main className={"text-white 0 container mx-auto"}>
			<form>
				<section
					id="create-team"
					className={
						"divide-gray-700 md:px-18 md:py-18 w-full px-8 py-10 lg:px-20 lg:py-20"
					}
				>
					<div className={"container mx-auto flex"}>
						<div className={"flex flex-col md:w-full"}>
							<h2 className={"mb-3  text-4xl font-bold leading-relaxed"}>
								Create a team
							</h2>
							<h2 className={"mb-3  text-2xl font-bold leading-relaxed"}>
								Enter your team name
							</h2>
							<input
								type="text"
								name="teamName"
								placeholder="Type here"
								className="input input-bordered w-full max-w-xs focus:border-mintGreen focus:ring-mintGreen"
							/>
							<input
								value={params.tournamentId}
								type="text"
								name="tournamentAbb"
								placeholder=""
								className="input input-bordered w-full max-w-xs focus:border-mintGreen focus:ring-mintGreen"
							/>
						</div>
					</div>
					<Button className="mt-4">Create</Button>
				</section>
			</form>
		</main>
	);
};

export default CreateTeamPage;
