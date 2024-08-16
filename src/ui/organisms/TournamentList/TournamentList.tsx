import React from "react";
import { type EmblaOptionsType } from "embla-carousel";
import { format } from "date-fns";
import { getTournaments, getUserTournaments, type TournamentResponseDto } from "../../../../client";
import { Carousel } from "@ui/organisms/Carousel/Carousel";
import { TournamentCard } from "@ui/molecules/Cards/TournamentCard";

const OPTIONS: EmblaOptionsType = { loop: false };

export const TournamentList = async ({
	useMobileCarousel = true,
	userTournaments = false,
}: {
	useMobileCarousel?: boolean;
	/** Get all tournaments associated with the active user */
	userTournaments?: boolean;
}) => {
	let tournamentData: TournamentResponseDto[] | undefined;

	if (userTournaments) {
		const { data, error } = await getUserTournaments();
		if (!error) {
			tournamentData = data;
		}
	} else {
		const { data, error } = await getTournaments();
		if (!error) {
			tournamentData = data;
		}
	}

	const tournamentSlices = tournamentData?.map((tournament) => {
		return (
			<TournamentCard
				key={tournament.id}
				title={tournament.name}
				date={{
					start: format(new Date(tournament.startDate || 0), "dd/MM/yyyy"),
					end: format(new Date(tournament.endDate || 0), "dd/MM/yyyy"),
				}}
				status={tournament?.isOngoing}
				img={`${process.env.NEXT_PUBLIC_API_URL}/tournaments/${tournament.abbreviation}/banner`}
				url={`/tournament/${tournament.abbreviation}`}
			/>
		);
	});

	return (
		<>
			{useMobileCarousel ? (
				<div className={"flex md:hidden"}>
					<Carousel slides={tournamentSlices} options={OPTIONS} />
				</div>
			) : (
				<div className={"flex w-full flex-col gap-10 md:hidden"}>
					{tournamentSlices?.map((slide) => slide)}
				</div>
			)}

			<div className={"hidden flex-col gap-10 md:flex md:w-full"}>
				{tournamentSlices?.map((slide) => slide)}
			</div>
		</>
	);
};
