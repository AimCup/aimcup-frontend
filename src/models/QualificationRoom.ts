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
}

export interface TeamBasedQualificationRoom extends QualificationRoom {
	teams: TeamResponseDto[];
}

export interface ParticipantBasedQualificationRoom extends QualificationRoom {
	participants: ParticipantResponseDto[];
}
