import React from "react";
import { FaPlay, FaUserAlt } from "react-icons/fa";
import { IoTime } from "react-icons/io5";
import { RiBarChartFill } from "react-icons/ri";
import { LiaLongArrowAltRightSolid } from "react-icons/lia";
import Link from "next/link";
import { format } from "date-fns";
import {
	MappoolService,
	StaffMemberService,
	type StageResponseDto,
	StageService,
	type TeamResponseDto,
	TeamService,
	TournamentService,
} from "../../../../../generated";
import { TeamCard } from "@ui/molecules/Cards/TeamCard";
import { Socials } from "@ui/organisms/Socials/Socials";
import RegisterToTournamentButton from "@ui/molecules/RegisterToTournamentButton/RegisterToTournamentButton";
import { ScheduleList } from "@ui/organisms/ScheduleList/ScheduleList";
import { MappoolStages } from "@ui/organisms/MappoolStages/MappoolStages";
import { tournamentTeamShowEnumAvailable } from "@/lib/helpers";
import Section from "@ui/atoms/Section/Section";
import { executeFetch } from "@/lib/executeFetch";
import StaffMember from "@ui/organisms/StaffMember/StaffMember";

const SingleTournament = async ({
	params,
}: {
	params: {
		tournamentId: string;
	};
}) => {
	const [getTournamentByAbbreviation, getStages, getStaffMembers] = await Promise.allSettled([
		TournamentService.getTournamentByAbbreviation(params.tournamentId),
		StageService.getStages(params.tournamentId),
		StaffMemberService.getStaffMembers(params.tournamentId),
	]);

	if (getTournamentByAbbreviation.status === "rejected") {
		throw new Error("Tournament not found"); //todo: change to proper error
	}
	if (getStages.status === "rejected") {
		throw new Error("Schedule not found"); //todo: change to proper error
	}
	if (getStaffMembers.status === "rejected") {
		throw new Error("Staff not found"); //todo: change to proper error
	}

	let teams: TeamResponseDto[] = [];
	let teamSize = "1vs1"; // 1vs1 for participants
	if (
		tournamentTeamShowEnumAvailable.includes(getTournamentByAbbreviation.value?.tournamentType)
	) {
		teamSize = `${getTournamentByAbbreviation.value?.minimumTeamSize}vs${getTournamentByAbbreviation.value?.minimumTeamSize}`;
		try {
			const getTeamsByTournament = await TeamService.getTeamsByTournament(
				params.tournamentId,
			);
			teams = getTeamsByTournament;
		} catch (error) {
			throw new Error("Teams not found"); //todo: change to proper error
		}
	}

	const isStaff = getStaffMembers.value.some(
		(staff) => staff.staffMembers && staff.staffMembers.length > 0,
	);

	const mappools = await executeFetch(
		MappoolService.getMappoolsByTournament(params.tournamentId),
	);

	const getStageByStageType = (stageType: string): StageResponseDto => {
		return getStages.value.find(
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
								{getTournamentByAbbreviation?.value?.name}
							</h2>
							{getTournamentByAbbreviation?.value?.isOngoing && (
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
									getTournamentByAbbreviation.value?.tournamentType,
								)}
								shouldDisplay={getTournamentByAbbreviation.value?.canRegister}
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
							new Date(getTournamentByAbbreviation?.value?.startDate || 0),
							"MM/dd/yyyy",
						)}{" "}
						-{" "}
						{format(
							new Date(getTournamentByAbbreviation?.value?.endDate || 0),
							"MM/dd/yyyy",
						)}
					</span>
					<span className={"flex items-center gap-2"}>
						<RiBarChartFill />{" "}
						{getTournamentByAbbreviation.value?.minimumRankLimit || 0} -{" "}
						{getTournamentByAbbreviation.value?.maximumRankLimit || 0}
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
					<ScheduleList scheduleList={getStages.value} />
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
			{mappools.status && mappools.response.length !== 0 ? (
				<Section id="mappool" className={"flex-col"}>
					<div className={"flex flex-col md:w-full"}>
						<h2
							className={
								"mb-4 text-4xl font-bold leading-relaxed transition-all group-hover:underline"
							}
						>
							Mappool
						</h2>
						{mappools.response.map((mappool) => {
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
											stageEnum: stage.stageType,
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
			{getTournamentByAbbreviation.value?.tournamentType === "TEAM_VS" &&
				teams.length > 0 && (
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
											<TeamCard
												team={team}
												tournamentAbb={params.tournamentId}
											/>
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
				{getTournamentByAbbreviation.value.prizePool?.map((prize) => (
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
			{isStaff && (
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
					<div className={"grid grid-cols-2 gap-4 md:w-3/5"}>
						{getStaffMembers.value.map((staff) => {
							const role = staff.roleName;

							return (
								staff?.staffMembers?.map((member) => (
									<StaffMember key={member.id} staffMember={member} role={role} />
								)) || null
							);
						})}
					</div>
				</Section>
			)}
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
