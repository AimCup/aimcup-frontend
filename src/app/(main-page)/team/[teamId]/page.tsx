import React from "react";

const TeamPage = ({ params }: { params: { teamId: string } }) => {
	return (
		<div>
			Team Page :)
			<strong>{params.teamId}</strong>
		</div>
	);
};

export default TeamPage;
