import React from "react";
import Image from "next/image";

export const Avatar = ({
	src,
	alt,
	notificationCount,
	...props
}: {
	src?: string;
	alt?: string;
	notificationCount?: number;
	props?: { [key: string]: never };
}) => {
	return (
		<div className="relative max-h-[36px] min-h-[36px] min-w-[36px] max-w-[36px]">
			<Image
				src={src || "/empty-avatar.webp"}
				fill={true}
				alt={alt || "avatar"}
				className={`rounded-md`}
				{...props}
			/>
			{notificationCount && (
				<div className="text-white absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-md bg-deepRed text-xs">
					{typeof notificationCount === "number" && notificationCount > 9
						? "9+"
						: notificationCount}
				</div>
			)}
		</div>
	);
};
