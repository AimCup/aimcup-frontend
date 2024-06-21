import React from "react";
import type {
	ParticipantResponseDto,
	RoleResponseDTO,
	TeamResponseDto,
	UserResponseDTO,
} from "../../generated";
import { MappoolCard } from "@ui/molecules/Cards/MappoolCard";
import { TournamentCard } from "@ui/molecules/Cards/TournamentCard";

function generateId(): string {
	return Math.random().toString(36).substr(2, 9);
}

function generateRole(): RoleResponseDTO {
	return {
		id: generateId(),
		name: `Role ${Math.floor(Math.random() * 10) + 1}`,
	};
}

function generateUser(): UserResponseDTO {
	return {
		id: generateId(),
		username: `User_${Math.random().toString(36).substr(2, 5)}`,
		osuId: Math.floor(Math.random() * 10000),
		roles: [generateRole()],
	};
}

function generateParticipant(): ParticipantResponseDto {
	return {
		id: generateId(),
		user: generateUser(),
	};
}

const participants = Array.from({ length: 8 }, generateParticipant);

export function generateTeam(): TeamResponseDto {
	return {
		id: generateId(),
		name: `Team_${Math.random().toString(36).substr(2, 5)}`,
		logoUrl: ``,
		captain: participants[0],
		participants: participants,
	};
}

export function generateUsers(count: number): UserResponseDTO[] {
	return Array.from({ length: count }, generateUser);
}

export const mappoolSlicesMock = [
	<MappoolCard
		key={1}
		title={"Demetori - Natsukashiki Touhou no Chi ~ Sic World"}
		modification={"HD"}
		author={"MonsieurSebas"}
		isCustom={true}
		mapInformation={{
			stars: 6.81,
			time: "4:05",
			bpm: 196,
			ar: 9,
			hp: 5,
			od: 7,
			cs: 3,
		}}
		img={"/tm1.png"}
	/>,
	<MappoolCard
		key={2}
		title={"xi - Blue Zenith"}
		modification={"HR"}
		author={"Asphyxia"}
		mapInformation={{
			stars: 2.81,
			time: "5:55",
			bpm: 126,
			ar: 19,
			hp: 52,
			od: 37,
			cs: 33,
		}}
		img={"/tm2.jpg"}
	/>,
	<MappoolCard
		key={3}
		title={"xi - Freedom Dive"}
		modification={"FM"}
		author={"Nakagawa-Kanon"}
		mapInformation={{
			stars: 5,
			time: "2:23",
			bpm: 154,
			ar: 5,
			hp: 1,
			od: 5,
			cs: 2,
		}}
		img={"/tm3.jpg_large"}
	/>,
	<MappoolCard
		key={4}
		title={"S3RL - MTC"}
		author={"Gero"}
		isCustom={true}
		mapInformation={{
			stars: 6.81,
			time: "4:05",
			bpm: 196,
			ar: 9,
			hp: 5,
			od: 7,
			cs: 3,
		}}
		img={"/tm4.jpg"}
	/>,
];

export const tournamentSlicesMock = [
	<TournamentCard
		key={1}
		title={"AimCup 2023"}
		date={"06-2025"}
		status={"Ongoing"}
		img={"/tm5.jpg"}
		url={`/tournament/1`}
	/>,
	<TournamentCard
		key={1}
		title={"AimCup 2024"}
		date={"06-2024"}
		status={"Upcoming"}
		img={"/tm4.jpg"}
		url={`/tournament/2`}
	/>,
	<TournamentCard
		key={1}
		title={"AimCup 2022"}
		date={"06-2025"}
		status={"Finished"}
		img={"/tm3.jpg_large"}
		url={`/tournament/3`}
	/>,
];
