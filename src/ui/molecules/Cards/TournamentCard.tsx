import React from "react";
import Image from "next/image";
import { IoTime } from "react-icons/io5";
import Link from "next/link";
import { TextBox } from "@ui/atoms/TextBox/TextBox";

export const TournamentCard = ({
	title,
	date,
	status,
	img,
	url,
}: {
	title: string;
	date: string;
	status: string;
	img?: string;
	url?: string;
}) => {
	return (
		<Link href={url || "#"} className={"block"}>
			<div className="border-white grid h-96 rounded-md border border-solid">
				<div className={"relative h-96"}>
					<Image
						className="embla__slide__img h-full w-full rounded-md object-cover md:hidden"
						src={img || `/placeholder.png`}
						alt="tournament-card"
						width={350}
						height={384}
					/>
					<Image
						className="embla__slide__img h-full w-full rounded-md object-cover md:flex"
						src={img || `/placeholder.png`}
						alt="tournament-card"
						fill={true}
					/>
					<div className="absolute left-2 top-2">
						<TextBox leftText={status} size={"sm"} />
					</div>
					<div className={"absolute -left-0.5 bottom-2.5 w-4/5 md:w-1/2"}>
						<TextBox leftText={title} rightText={date} icon={<IoTime />} />
					</div>
				</div>
			</div>
		</Link>
	);
};
