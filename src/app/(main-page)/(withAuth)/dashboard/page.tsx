import React from "react";
import Link from "next/link";
import CreateTournamentModal from "@/app/(main-page)/(withAuth)/dashboard/CreateTournamentModal";
import { getTournaments } from '../../../../../client'

const DashboardPage = async () => {
	const { data:tournaments } = await getTournaments();


	return (
		<div className={"w-full"}>
			<h1 className={"my-2 text-lg"}>Select tournament</h1>
			<div className={"grid gap-4 sm:grid-cols-1 lg:grid-cols-3"}>
				<CreateTournamentModal />
				{tournaments?.map((tournament) => (
					<Link
						href={`/dashboard/${tournament.abbreviation}`}
						key={tournament.abbreviation}
						className={"w-full shadow-lg"}
					>
						<div
							className={
								"flex h-64 w-full gap-2 rounded-md bg-opacity-20 bg-cover bg-center"
							}
							style={{
								backgroundImage: `url(${process.env.NEXT_PUBLIC_API_URL}/tournaments/${tournament.abbreviation}/banner)`,
							}}
						>
							<p
								style={{
									backgroundColor: "rgba(0, 0, 0, 0.7)",
								}}
								className={"m-1 self-end rounded-md bg-opacity-70 p-4"}
							>
								{tournament.name}
							</p>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
};

export default DashboardPage;
