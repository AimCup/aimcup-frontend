"use client";

import React from "react";
import Image from "next/image";
import type { ParticipantResponseDto } from "../../../../client";

interface AvatarGroupProps {
	participants: ParticipantResponseDto[];
	max?: number;
}

export const AvatarGroup = ({
	participants,
	max = 4,
}: AvatarGroupProps) => {
	if (participants.length === 0) {
		return null;
	}

	const visibleParticipants = participants.slice(0, max);
	const remainingCount = participants.length - max;

	return (
		<div className="flex items-center -space-x-2">
			{visibleParticipants.map((participant, index) => (
				<div
					key={participant.id}
					className="avatar relative"
					style={{
						zIndex: visibleParticipants.length - index,
					}}
					title={participant.user.username}
				>
					<div className="mask mask-squircle h-5 w-5 border-2 border-base-100">
						<Image
							src={`https://a.ppy.sh/${participant.user.osuId}`}
							alt={participant.user.username}
							width={20}
							height={20}
						/>
					</div>
				</div>
			))}
			{remainingCount > 0 && (
				<div
					className="avatar relative"
					style={{
						zIndex: 0,
					}}
					title={`+${remainingCount} more participants`}
				>
					<div className="mask mask-squircle h-5 w-5 border-2 border-base-100 bg-base-200 flex items-center justify-center text-xs font-semibold text-base-content">
						+{remainingCount}
					</div>
				</div>
			)}
		</div>
	);
};

