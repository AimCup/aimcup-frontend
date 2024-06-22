import React from "react";
import Link from "next/link";
import { mappoolSlicesMock } from "@/mocks/mockups";

const SingleTournamentMappool = async () => {
	return (
		<main className={"text-white container mx-auto"}>
			<section
				id="mappool"
				className={
					"divide-gray-700 md:px-18 my-12 flex w-full flex-col gap-4 px-8 lg:px-20"
				}
			>
				<div className={"mb-10 flex"}>
					<div className={"flex flex-col gap-4 md:flex-row md:items-center"}>
						<h2 className={"text-4xl font-bold "}>Mappool</h2>
					</div>
				</div>
				<div className={"mb-4 flex"}>
					<div className={"flex items-center gap-4"}>
						<h2 className={"text-2xl font-bold "}>Qualifier</h2>
						<div className={"flex self-end"}>
							<Link href={``} className={"text-flatRed hover:underline"}>
								Download mappack
							</Link>
						</div>
					</div>
				</div>
				<div className={"flex flex-col gap-10 md:w-full"}>
					{mappoolSlicesMock.map((slide) => slide)}
				</div>

				<div className={"mb-4 mt-10 flex"}>
					<div className={"flex items-center gap-4"}>
						<h2 className={"text-2xl font-bold "}>Round of 32</h2>
						<div className={"flex self-end"}>
							<Link href={``} className={"text-flatRed hover:underline"}>
								Download mappack
							</Link>
						</div>
					</div>
				</div>
				<div className={"flex flex-col gap-10 md:w-full"}>
					{mappoolSlicesMock.map((slide) => slide)}
				</div>
			</section>
		</main>
	);
};

export default SingleTournamentMappool;
