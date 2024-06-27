import type {
	ParticipantResponseDto,
	RoleResponseDTO,
	TeamResponseDto,
	UserResponseDTO,
} from "../../generated";

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
