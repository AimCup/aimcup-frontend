import React from "react";
import { FaPlay, FaUserAlt } from "react-icons/fa";
import { IoTime } from "react-icons/io5";
import { RiBarChartFill } from "react-icons/ri";
import { LiaLongArrowAltRightSolid } from "react-icons/lia";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { cookies } from "next/headers";
import {
	client,
	getMappoolsByTournament,
	getParticipants,
	getQualificationRooms,
	getStaffMembers1,
	getStages,
	getTeamsByTournament,
	getTournamentByAbbreviation,
	type ParticipantResponseDto,
	type StageResponseDto,
	type stageType,
	type TeamResponseDto,
	type tournamentType,
} from "../../../../../client";
import { TeamCard } from "@ui/molecules/Cards/TeamCard";
import { Socials } from "@ui/organisms/Socials/Socials";
import RegisterToTournamentButton from "@ui/molecules/RegisterToTournamentButton/RegisterToTournamentButton";
import { ScheduleList } from "@ui/organisms/ScheduleList/ScheduleList";
import { MappoolStages } from "@ui/organisms/MappoolStages/MappoolStages";
import { tournamentTeamShowEnumAvailable } from "@/lib/helpers";
import Section from "@ui/atoms/Section/Section";
import StaffMember from "@ui/organisms/StaffMember/StaffMember";

const SingleTournament = async ({
	params,
}: {
	params: {
		tournamentId: string;
	};
}) => {
	const cookie = cookies().get("JWT")?.value;
	// configure internal service client
	client.setConfig({
		// set default base url for requests
		baseUrl: process.env.NEXT_PUBLIC_API_URL,
		// set default headers for requests
		headers: {
			Cookie: `token=${cookie}`,
		},
	});
	// Fetch all independent data in parallel (previously a sequential waterfall of 5+ round-trips).
	const [
		{ data: getTournamentByAbbreviationData },
		{ data: getStagesData },
		{ data: getStaffMembers },
		{ data: getQualificationRoomsData },
		{ data: mappools },
	] = await Promise.all([
		getTournamentByAbbreviation({ path: { abbreviation: params.tournamentId } }),
		getStages({ path: { abbreviation: params.tournamentId } }),
		getStaffMembers1({ path: { abbreviation: params.tournamentId } }),
		getQualificationRooms({ path: { abbreviation: params.tournamentId } }),
		getMappoolsByTournament({ path: { abbreviation: params.tournamentId } }),
	]);

	let teams: TeamResponseDto[] = [];
	let participants: ParticipantResponseDto[] = [];
	let teamSize = "1vs1"; // 1vs1 for participants
	if (
		tournamentTeamShowEnumAvailable.includes(
			getTournamentByAbbreviationData?.tournamentType as tournamentType,
		)
	) {
		const ms = getTournamentByAbbreviationData?.matchSize;
		teamSize = ms ? `${ms}v${ms}` : `${getTournamentByAbbreviationData?.minimumTeamSize}v${getTournamentByAbbreviationData?.minimumTeamSize}`;

		// teams + (auction) participants depend on the tournament type resolved above.
		const [{ data: teamsData }, participantsResult] = await Promise.all([
			getTeamsByTournament({ path: { abbreviation: params.tournamentId } }),
			getTournamentByAbbreviationData?.tournamentType === "AUCTION"
				? getParticipants({ path: { abbreviation: params.tournamentId } })
				: Promise.resolve(null),
		]);
		teams = teamsData || [];

		if (participantsResult) {
			participants = [...(participantsResult.data || [])].sort(
				(a, b) => (a.user.globalRank ?? 999999999) - (b.user.globalRank ?? 999999999),
			);
		}
	}

	const getStageByStageType = (stageType: string): StageResponseDto => {
		return getStagesData?.find(
			(stage: StageResponseDto) => stage.stageType === stageType,
		) as StageResponseDto;
	};

	return (
		<>
			<Section id="title" className={"flex-col"}>
				<div className={"flex flex-col"}>
					<div className={"flex"}>
						<div className={"flex flex-col gap-4 md:flex-row md:items-center"}>
							<h2 className={"text-4xl font-bold leading-relaxed "}>
								{getTournamentByAbbreviationData?.name}
							</h2>
							{getTournamentByAbbreviationData?.isOngoing && (
								<div className={"flex items-center gap-4 md:justify-start"}>
									<span className={"h-2 w-2 rounded-full bg-deepRed"} />
									<span className={"text-xl text-flatRed md:text-2xl"}>
										Ongoing
									</span>
								</div>
							)}
						</div>
					</div>
					<div className={"flex"}>
						<div className={"flex items-center gap-4"}>
							{/*{getTournamentByAbbreviation.value.canRegister && (*/}
							<RegisterToTournamentButton
								tournamentId={params.tournamentId}
								isTeamTournament={tournamentTeamShowEnumAvailable.includes(
									getTournamentByAbbreviationData?.tournamentType as tournamentType,
								)}
								tournamentType={getTournamentByAbbreviationData?.tournamentType as tournamentType}
								shouldDisplay={
									getTournamentByAbbreviationData?.canRegister || false
								}
							/>
							{/*)}*/}
							{/*<span className={"text-md text-flatRed"}>Apply for staff</span>*/}
						</div>
					</div>
				</div>
			</Section>
			<Section id="general-info" className={"flex-col"}>
				<div className={"flex"}>
					<div className={"flex items-center gap-4"}>
						<h2 className={"text-4xl font-bold leading-relaxed"}>General Info</h2>
					</div>
				</div>
				<div className={"grid  grid-cols-2 grid-rows-2 gap-5"}>
					<span className={"flex items-center gap-2"}>
						<FaUserAlt /> {teamSize}
					</span>
					<span className={"flex items-center gap-2"}>
						<FaPlay /> Relax
					</span>
					<span className={"flex items-center gap-2"}>
						<IoTime />{" "}
						{format(
							new Date(getTournamentByAbbreviationData?.startDate || 0),
							"dd/MM/yyyy",
						)}{" "}
						-{" "}
						{format(
							new Date(getTournamentByAbbreviationData?.endDate || 0),
							"dd/MM/yyyy",
						)}
					</span>
					<span className={"flex items-center gap-2"}>
						<RiBarChartFill /> {getTournamentByAbbreviationData?.minimumRankLimit || 0}{" "}
						- {getTournamentByAbbreviationData?.maximumRankLimit || 0}
					</span>
				</div>
			</Section>
			<Section id="rules" className={"flex-col"}>
				<div className={"flex"}>
					<Link
						href={`${params.tournamentId}/rules`}
						className={"group flex cursor-pointer items-center gap-4 "}
					>
						<h2
							className={
								"text-4xl font-bold leading-relaxed transition-all group-hover:underline"
							}
						>
							Rules
						</h2>{" "}
						<LiaLongArrowAltRightSolid
							size={45}
							className={
								"transition-all group-hover:-rotate-45 group-hover:transform"
							}
						/>
					</Link>
				</div>
				<div className={"grid grid-cols-1 gap-10"}>
					<span>
						Please read the tournament rules provided in the <b>link below</b>. By
						registering and participating in the tournament, you agree to comply with
						these rules throughout the event. Any violation of the rules may result in{" "}
						<b>disqualification or other penalties</b> as outlined in the regulations.
					</span>
				</div>
				<div className={"flex"}>
					<Link
						href={`${params.tournamentId}/rules`}
						className={"text-flatRed hover:underline"}
					>
						Read full rules
					</Link>
				</div>
			</Section>
			<Section id="schedule" className={"flex-col"}>
				<div className={"flex"}>
					<Link
						href={`${params.tournamentId}/schedule`}
						className={"group flex cursor-pointer items-center gap-4 "}
					>
						<h2
							className={
								"text-4xl font-bold leading-relaxed transition-all group-hover:underline"
							}
						>
							Schedule
						</h2>{" "}
						<LiaLongArrowAltRightSolid
							size={45}
							className={
								"transition-all group-hover:-rotate-45 group-hover:transform"
							}
						/>
					</Link>
				</div>
				<div className={"grid grid-cols-1 gap-4 md:grid-cols-2"}>
					<ScheduleList scheduleList={getStagesData || []} />
				</div>
				<div className={"flex"}>
					<Link
						href={`${params.tournamentId}/schedule`}
						className={"text-flatRed hover:underline"}
					>
						See match schedule
					</Link>
				</div>
			</Section>
			{getQualificationRoomsData?.length && getQualificationRoomsData?.length > 0 && (
				<Section id="schedule" className={"flex-col"}>
					<div className={"flex"}>
						<Link
							href={`${params.tournamentId}/qualification-rooms`}
							className={"group flex cursor-pointer items-center gap-4 "}
						>
							<h2
								className={
									"text-4xl font-bold leading-relaxed transition-all group-hover:underline"
								}
							>
								Qualification rooms
							</h2>{" "}
							<LiaLongArrowAltRightSolid
								size={45}
								className={
									"transition-all group-hover:-rotate-45 group-hover:transform"
								}
							/>
						</Link>
					</div>
				</Section>
			)}
			{mappools && mappools.length !== 0 ? (
				<Section id="mappool" className={"flex-col"}>
					<div className={"flex flex-col md:w-full"}>
						<h2
							className={
								"mb-4 text-4xl font-bold leading-relaxed transition-all group-hover:underline"
							}
						>
							Mappool
						</h2>
						{mappools?.map((mappool) => {
							const stage = getStageByStageType(mappool.stage);
							return (
								<div className={"m-2"} key={mappool.id}>
									<MappoolStages
										stage={{
											id: stage.id,
											date: {
												start: stage.startDate,
												end: stage.endDate,
											},
											stageEnum: stage.stageType as stageType,
										}}
										mappool={mappool}
										tournamentAbbreviation={params.tournamentId}
									/>
								</div>
							);
						})}
					</div>
				</Section>
			) : undefined}
			{getTournamentByAbbreviationData?.tournamentType === "AUCTION" && participants.length > 0 && (
				<Section id="players" className={"flex-col"}>
					<div className={"flex"}>
						<Link
							href={`${params.tournamentId}/players`}
							className={"group flex cursor-pointer items-center gap-4"}
						>
							<h2 className={"text-4xl font-bold leading-relaxed transition-all group-hover:underline"}>
								Players
							</h2>
							<LiaLongArrowAltRightSolid size={45} className={"transition-all group-hover:-rotate-45 group-hover:transform"} />
						</Link>
					</div>
					<div className={"grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3"}>
						{participants.slice(0, 6).map((p) => (
							<div key={p.id} className={"flex items-center gap-3 rounded-xl bg-tuned p-3"}>
								<div className="avatar">
									<div className="mask mask-squircle h-10 w-10">
										<Image
											src={`https://a.ppy.sh/${p.user.osuId}`}
											alt={p.user.username}
											width={40}
											height={40}
										/>
									</div>
								</div>
								<div className="flex flex-col">
									<span className="font-bold">{p.user.username}</span>
									{p.user.globalRank ? (
										<span className="text-xs text-gray-400">#{p.user.globalRank.toLocaleString('en-US')}</span>
									) : null}
								</div>
							</div>
						))}
					</div>
					<Link href={`${params.tournamentId}/players`} className={"text-flatRed hover:underline"}>
						See all players ({participants.length})
					</Link>
				</Section>
			)}
			{getTournamentByAbbreviationData?.tournamentType === "TEAM_VS" && teams.length > 0 && (
				<Section id="teams" className={"flex-col"}>
					<div className={"flex"}>
						<Link
							href={`${params.tournamentId}/teams`}
							className={"group flex cursor-pointer items-center gap-4 "}
						>
							<h2
								className={
									"text-4xl font-bold leading-relaxed transition-all group-hover:underline"
								}
							>
								Teams
							</h2>{" "}
							<LiaLongArrowAltRightSolid
								size={45}
								className={
									"transition-all group-hover:-rotate-45 group-hover:transform"
								}
							/>
						</Link>
					</div>
					<div className={"grid grid-cols-1 gap-10 md:grid-cols-2"}>
						{teams.map((team, index) => {
							if (index > 1) {
								return null;
							}
							return (
								<React.Fragment key={team.id}>
									<div>
										<TeamCard team={team} tournamentAbb={params.tournamentId} />
									</div>
								</React.Fragment>
							);
						})}
					</div>
				</Section>
			)}

			<Section id="prizes" className={"flex-col gap-3"}>
				<div className={"flex"}>
					<h2 className={"text-4xl font-bold leading-relaxed"}>Prizes</h2>
				</div>
				{getTournamentByAbbreviationData?.prizePool?.map((prize) => (
					<div
						key={prize.type}
						className={
							"flex items-center justify-between gap-4 md:w-1/2 lg:w-1/3 xl:w-1/2"
						}
					>
						<span className={"font-bold"}>Place No.{prize.type + 1}</span>
						<span
							className={
								" h-4 flex-1 border-b-2 border-dotted border-deepRed opacity-30"
							}
						/>
						<span>{prize.prize}</span>
					</div>
				))}
			</Section>
			<Section id="staff" className={"flex-col gap-3"}>
				<div className={"flex"}>
					<Link
						href={`${params.tournamentId}/staff`}
						className={"group mb-4 flex cursor-pointer items-center gap-4 "}
					>
						<h2
							className={
								"text-4xl font-bold leading-relaxed transition-all group-hover:underline"
							}
						>
							Staff
						</h2>{" "}
						<LiaLongArrowAltRightSolid
							size={45}
							className={
								"transition-all group-hover:-rotate-45 group-hover:transform"
							}
						/>
					</Link>
				</div>
				<div className={"grid gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-4"}>
					{getStaffMembers?.map((member) => (
						<StaffMember key={member.id} staffMember={member} />
					))}
				</div>
			</Section>
			<Section id="socials" className={"flex-col gap-3"}>
				<div className={"flex"}>
					<h2
						className={
							"text-4xl font-bold leading-relaxed transition-all group-hover:underline"
						}
					>
						Links
					</h2>
				</div>
				<Socials />
			</Section>
		</>
	);
};

export default SingleTournament;
