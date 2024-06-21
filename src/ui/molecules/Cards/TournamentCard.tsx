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
	status?: string;
	img?: string;
	url?: string;
}) => {
	return (
		<Link href={url || ""} className={"group block transition-all"}>
			<div className="grid h-96 overflow-hidden rounded-md border border-solid border-transparent bg-tuned md:rounded-2xl">
				<div className={"relative h-96 overflow-hidden"}>
					<Image
						className="embla__slide__img h-1/2 w-full rounded-t-md object-cover transition-transform duration-300 ease-in-out group-hover:scale-105 md:hidden"
						src={img || `/placeholder.png`}
						alt="tournament-card"
						width={350}
						height={384}
					/>
					<div
						className={
							"absolute bottom-0 left-0 right-0 top-0 z-10 hidden bg-tuned opacity-30 md:flex md:rounded-2xl"
						}
					></div>
					<Image
						className="embla__slide__img hidden h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105 md:flex md:rounded-2xl"
						src={img || `/placeholder.png`}
						alt="tournament-card"
						fill={true}
					/>
					{status && (
						<div className="absolute left-2 top-2 z-20 md:left-6 md:top-6">
							<TextBox size={"sm"}>{status}</TextBox>
						</div>
					)}

					<div
						className={
							"absolute -left-0.5 bottom-6 z-20 hidden flex-col text-2xl md:flex md:w-4/5 md:min-w-max lg:w-3/5 lg:min-w-max"
						}
					>
						<TextBox>
							<div className={"flex w-full items-center gap-5 pl-8"}>
								<span>{title}</span>
								<span
									className={
										"ml-auto flex items-center gap-2 text-base opacity-70"
									}
								>
									<IoTime /> {date}
								</span>
							</div>
						</TextBox>
					</div>
					<div
						className={
							"bg-black absolute bottom-0 flex h-1/2 w-full flex-col justify-between p-5 md:hidden"
						}
					>
						<h3 className={"text-white text-2xl font-bold"}>{title}</h3>
						<span className={"flex items-center gap-2"}>
							<IoTime /> {date}
						</span>
					</div>
				</div>
			</div>
		</Link>
	);
};
