import type {
	ParticipantResponseDto,
	QualificationRoomResponseDto,
	StaffMemberResponseDto,
	TeamResponseDto,
} from "../../client";

interface QualificationRoom extends QualificationRoomResponseDto {
	id: string;
	number: number;
	isClosed: number;
	maxSlots: number;
	occupiedSlots: number;
	staffMember: StaffMemberResponseDto;
	startDate: string;
	// osu! multiplayer link, set once the lobby has been played. Optional until the generated client includes it.
	mpUrl?: string | null;
}

export interface TeamBasedQualificationRoom extends QualificationRoom {
	teams: TeamResponseDto[];
}

export interface ParticipantBasedQualificationRoom extends QualificationRoom {
	participants: ParticipantResponseDto[];
}
