import React from "react";

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
		<a
			className={
				"flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-primary-light transition-opacity hover:opacity-80"
			}
			href={socialItem.link}
			rel="noreferrer noopener"
			target="_blank"
		>
			{socialItem.icon}
		</a>
	);
};
