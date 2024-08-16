import React from "react";
import { PiCrownSimpleFill } from "react-icons/pi";
import Link from "next/link";
import { type TeamResponseDto } from "../../../../client";
import { Avatar } from "@ui/atoms/Avatar/Avatar";

export const TeamCard = ({
	team,
	tournamentAbb,
}: {
	team: TeamResponseDto;
	tournamentAbb: string;
}) => {
	if (!team) {
		return null;
	}
	return (
		<Link
			href={`/tournament/${tournamentAbb}/teams/${team.id}`}
			className={"flex w-full flex-col gap-4 rounded-md bg-tuned p-6 text-primary-light"}
		>
			<div className={"flex items-center gap-2"}>
				<img src={team?.logoUrl} className={"h-10 w-10 rounded-md"} />
				<h3 className={"text-2xl font-bold"}>{team?.name}</h3>
			</div>
			<h3 className={"gap-2 text-lg"}>x̄ PP: {team?.averagePerformancePoints}</h3>
			<div className={"grid grid-cols-2 gap-4"}>
				{team?.participants?.map((participant) => (
					<div key={participant.id} className={"flex items-center gap-4"}>
						<div className={"relative"}>
							<Avatar src={`https://a.ppy.sh/${participant?.user?.osuId}`} />
							{participant.user?.id === team?.captain?.user?.id && (
								<div className={"absolute -right-2 -top-2 rounded bg-deepCharcoal"}>
									<PiCrownSimpleFill size={20} className={"text-deepRed"} />
								</div>
							)}
						</div>

						<span className={"overflow-hidden truncate"}>
							{participant.user?.username}
						</span>
					</div>
				))}
			</div>
		</Link>
	);
};
