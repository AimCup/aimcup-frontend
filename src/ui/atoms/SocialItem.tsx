import React from "react";
import Link from "next/link";

export const SocialItem = ({
	socialItem,
}: {
	socialItem: {
		name: string;
		link: string;
		icon: React.ReactNode;
	};
}) => {
	return (
		<Link
			className={
				"flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-primary-light transition-opacity hover:opacity-80"
			}
			href={socialItem.link}
			rel="noreferrer"
			target="_blank"
		>
			{socialItem.icon}
		</Link>
	);
};
