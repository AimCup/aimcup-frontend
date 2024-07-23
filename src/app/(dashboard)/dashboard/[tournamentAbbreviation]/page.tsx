import React from "react";

const DashboardHome = async ({
	params,
}: {
	params: {
		tournamentAbbreviation: string;
	};
}) => {
	return (
		<main className={"text-white container mx-auto"}>
			<p>{params.tournamentAbbreviation}</p>
		</main>
	);
};

export default DashboardHome;
