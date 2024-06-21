import React from "react";
import { mappoolSlicesMock } from "@/mocks/mockups";

const SingleTournamentMappool = async () => {
	return (
		<main className={"text-white"}>
			<section
				id="qualifier"
				className={"divide-gray-700 md:px-18 md:py-18 w-full px-8 py-10 lg:px-20 lg:py-20"}
			>
				<div className={"container mx-auto flex"}>
					<div className={"flex flex-col md:w-full"}>
						<h2 className={"mb-3  text-3xl font-bold leading-relaxed"}>Qualifier</h2>
						<div className={"flex flex-col gap-10 md:w-full"}>
							{mappoolSlicesMock.map((slide) => slide)}
						</div>
					</div>
				</div>
			</section>
			<section
				id="Round of 32"
				className={"divide-gray-700 md:px-18 md:py-18 w-full px-8 py-10 lg:px-20 lg:py-20"}
			>
				<div className={"container mx-auto flex"}>
					<div className={"flex flex-col md:w-full"}>
						<h2 className={"mb-3  text-3xl font-bold leading-relaxed"}>Tournaments!</h2>
						<div className={"flex flex-col gap-10 md:w-full"}>
							{mappoolSlicesMock.map((slide) => slide)}
						</div>
					</div>
				</div>
			</section>
		</main>
	);
};

export default SingleTournamentMappool;
