import "server-only";
import React from "react";
import { type EmblaOptionsType } from "embla-carousel";
import { format } from "date-fns";
import { TournamentService } from "../../../../generated";
import { Carousel } from "@ui/organisms/Carousel/Carousel";
import { TournamentCard } from "@ui/molecules/Cards/TournamentCard";
const OPTIONS: EmblaOptionsType = { loop: false };

export const TournamentList = async () => {
	const data = await TournamentService.getTournaments();
	const tournamentSlices = data.map((tournament) => {
		return (
			<TournamentCard
				key={tournament.id}
				title={tournament.name}
				date={{
					start: format(new Date(tournament.startDate || 0), "MM/dd/yyyy"),
					end: format(new Date(tournament.endDate || 0), "MM/dd/yyyy"),
				}}
				status={tournament?.isOngoing}
				img={`${process.env.API_URL}/tournaments/${tournament.abbreviation}/banner`}
				url={`/tournament/${tournament.abbreviation}`}
			/>
		);
	});

	if (data?.length === 0) {
		return null;
	}

	return (
		<section
			id="tournaments"
			className={"divide-gray-700 md:px-18 md:py-18 w-full px-8 py-10 lg:px-20 lg:py-20"}
		>
			<div className={"container mx-auto flex"}>
				<div className={"flex flex-col md:w-full"}>
					<h2 className={"mb-3  text-3xl font-bold leading-relaxed"}>Tournaments!</h2>
					<div className={"flex md:hidden"}>
						<Carousel slides={tournamentSlices} options={OPTIONS} />
					</div>
					<div className={"hidden flex-col gap-10 md:flex md:w-full"}>
						{tournamentSlices.map((slide) => slide)}
					</div>
				</div>
			</div>
		</section>
	);
};
