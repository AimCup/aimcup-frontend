import React from "react";
import { TeamCard } from "@ui/molecules/Cards/TeamCard";
import { generateTeam } from "@/mocks/mockups";

const SingleTournamentTeams = async () => {
	return (
		<main className={"text-white container mx-auto"}>
			<section
				id="teams"
				className={
					"divide-gray-700 md:px-18 my-12 flex w-full flex-col gap-4 px-8 lg:px-20"
				}
			>
				<div className={"mb-10 flex"}>
					<div className={"flex flex-col gap-4 md:flex-row md:items-center"}>
						<h2 className={"text-4xl font-bold "}>Teams</h2>
					</div>
				</div>
				<div className={"grid grid-cols-1 gap-10 md:grid-cols-2"}>
					<div>
						<TeamCard team={generateTeam()} />
					</div>
					<div className={"hidden md:flex"}>
						<TeamCard team={generateTeam()} />
					</div>
				</div>
				<div className={"grid grid-cols-1 gap-10 md:grid-cols-2"}>
					<div>
						<TeamCard team={generateTeam()} />
					</div>
					<div className={"hidden md:flex"}>
						<TeamCard team={generateTeam()} />
					</div>
				</div>
				<div className={"grid grid-cols-1 gap-10 md:grid-cols-2"}>
					<div>
						<TeamCard team={generateTeam()} />
					</div>
					<div className={"hidden md:flex"}>
						<TeamCard team={generateTeam()} />
					</div>
				</div>
				<div className={"grid grid-cols-1 gap-10 md:grid-cols-2"}>
					<div>
						<TeamCard team={generateTeam()} />
					</div>
					<div className={"hidden md:flex"}>
						<TeamCard team={generateTeam()} />
					</div>
				</div>
			</section>
		</main>
	);
};

export default SingleTournamentTeams;
