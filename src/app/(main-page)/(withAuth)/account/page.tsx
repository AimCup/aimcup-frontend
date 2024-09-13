import React, { Suspense } from "react";
import { UserInformation } from "@ui/organisms/UserInformation/UserInformation";
import { TournamentList } from "@ui/organisms/TournamentList/TournamentList";
import { Loading } from "@ui/atoms/Loading/Loading";
import Section from "@ui/atoms/Section/Section";
import UserTeams from "@ui/organisms/UserInformation/UserTeams";

const AccountPage = async () => {
	return (
		<div className={"flex w-full flex-col"}>
			<Section className={"flex-col"}>
				<UserInformation />
			</Section>
			<Suspense fallback={<Loading size={"md"} />}>
				<Section id="my-tournaments">
					<div className={"flex flex-col md:w-full"}>
						<h2 className={"mb-3  text-3xl font-bold leading-relaxed"}>
							My tournaments
						</h2>
						<TournamentList userTournaments={true} />
					</div>
				</Section>
			</Suspense>
			<Suspense fallback={<Loading size={"md"} />}>
				<Section id="my-teams" className={"flex w-full flex-col gap-4"}>
					<h2 className={"mb-3  text-3xl font-bold leading-relaxed"}>My teams</h2>
					<UserTeams />
				</Section>
			</Suspense>
			{/*<Suspense fallback={<Loading size={"md"} />}>*/}
			{/*	<Section id="upcomming-matches">*/}
			{/*		<div className={"flex flex-col md:w-full"}>*/}
			{/*			<h2 className={"mb-3  text-3xl font-bold leading-relaxed"}>*/}
			{/*				Upcomming matches*/}
			{/*			</h2>*/}
			{/*			<TournamentList useMobileCarousel={false} />*/}
			{/*		</div>*/}
			{/*	</Section>*/}
			{/*</Suspense>*/}
		</div>
	);
};

export default AccountPage;
