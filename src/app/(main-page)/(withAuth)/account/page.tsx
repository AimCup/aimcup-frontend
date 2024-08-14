import React, { Suspense } from "react";
import { UserInformation } from "@ui/organisms/UserInformation/UserInformation";
import { TournamentList } from "@ui/organisms/TournamentList/TournamentList";
import { Loading } from "@ui/atoms/Loading/Loading";
import Section from "@ui/atoms/Section/Section";
import UserTeams from "@ui/organisms/UserInformation/UserTeams";

const AccountPage = async () => {
	return (
		<Section className={"flex-col"}>
			<UserInformation />
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
				<Section id="my-teams">
					<div className={"flex flex-col md:w-full"}>
						<h2 className={"mb-3  text-3xl font-bold leading-relaxed"}>My teams</h2>
						<UserTeams />
					</div>
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
		</Section>
	);
};

export default AccountPage;
