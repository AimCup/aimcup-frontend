import React from "react";
import { PiCrownSimpleFill } from "react-icons/pi";
import { type TeamResponseDto } from "../../../../generated";
import { Avatar } from "@ui/atoms/Avatar/Avatar";

export const TeamCard = ({ team }: { team: TeamResponseDto }) => {
	if (!team) {
		return null;
	}
	return (
		<div className={"flex w-full flex-col gap-4 rounded-md bg-tuned p-6 text-primary-light"}>
			<h3 className={"text-2xl font-bold"}>{team?.name}</h3>
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
		</div>
	);
};
