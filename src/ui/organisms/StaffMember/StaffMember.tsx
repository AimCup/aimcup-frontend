import React from "react";
import { StaffMemberResponseDto } from "../../../../generated";
import { Avatar } from "@ui/atoms/Avatar/Avatar";
import Link from "next/link";

type StaffMemberProps = {
	staffMember: StaffMemberResponseDto;
	role?: string;
};

const StaffMember = (props: StaffMemberProps) => {
	const { staffMember, role } = props;
	return staffMember.user ? (
		<Link
			href={`https://osu.ppy.sh/users/${staffMember.user.osuId}/osu`}
			target={"_blank"}
			className={"flex max-w-min items-center gap-4 rounded-md p-2 hover:shadow-lg"}
		>
			<Avatar src={`https://a.ppy.sh/${staffMember.user.osuId}`} />

			<span className={"flex items-center gap-4 overflow-hidden truncate"}>
				{staffMember.user.username}
				<span className={"text-xs opacity-60"}>{role}</span>
			</span>
		</Link>
	) : (
		<Link
			href={staffMember.redirectUrl || "#"}
			target={"_blank"}
			className={"flex items-center gap-4"}
		>
			<div className={"relative"}>
				<Avatar src={staffMember.imageUrl} />
			</div>

			<span className={"flex items-center gap-4 overflow-hidden truncate"}>
				{staffMember.username}
				<span className={"text-xs opacity-60"}>{role}</span>
			</span>
		</Link>
	);
};

export default StaffMember;
