import React from "react";
import Image from "next/image";
import { IoTime } from "react-icons/io5";
import Link from "next/link";
import { TextBox } from "@ui/atoms/TextBox/TextBox";
export const TournamentCard = () => {
	return (
		<Link href={"/tournament/1"} className={"block "}>
			<div className="border-white grid h-96 rounded-md border border-solid">
				<div className={"relative h-96"}>
					<Image
						className="embla__slide__img h-full w-full rounded-md object-cover"
						src={`/placeholder.png`}
						alt="Your alt text"
						width={350}
						height={384}
					/>
					<div className="absolute left-2 top-2">
						<TextBox leftText={"Ongoing"} />
					</div>
					<div className={"absolute -left-0.5 bottom-2.5 w-4/5"}>
						<TextBox
							leftText={"Aim Cup 2023"}
							rightText={"04-2021 - 12-2022"}
							icon={<IoTime />}
						/>
					</div>
				</div>
			</div>
		</Link>
	);
};
