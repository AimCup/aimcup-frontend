import React from "react";
import Image from "next/image";

export const TournamentCard = () => {
	return (
		<div className="grid h-96 grid-rows-2">
			<div className={"relative"}>
				<Image
					className="embla__slide__img h-full w-full rounded-md object-cover"
					src={`/placeholder.png`}
					alt="Your alt text"
					width={350}
					height={150}
				/>
			</div>

			<div>awd</div>
		</div>
	);
};
