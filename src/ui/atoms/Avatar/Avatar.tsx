import React from "react";
import Image from "next/image";

export const Avatar = ({
	src,
	alt,
	className,
	notificationCount,
	...props
}: {
	src?: string;
	alt?: string;
	className?: string;
	notificationCount?: number;
	props?: { [key: string]: never };
}) => {
	return (
		<div className="relative">
			<Image
				src={src || "/empty-avatar.webp"}
				width={36}
				height={36}
				alt={alt || "avatar"}
				className={`rounded-md ${className}`}
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
