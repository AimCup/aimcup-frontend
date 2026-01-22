import { cookies } from "next/headers";
import { client, getUserTeams } from "../../../../client";
import { TeamCard } from "@ui/molecules/Cards/TeamCard";

const UserTeams = async () => {
	const cookie = cookies().get("JWT")?.value;
	// configure internal service client
	client.setConfig({
		// set default base url for requests
		baseUrl: process.env.NEXT_PUBLIC_API_URL,
		// set default headers for requests
		headers: {
			Cookie: `token=${cookie}`,
		},
	});
	const { data: userTeams } = await getUserTeams();
	if (!userTeams) {
		return <div>No teams found</div>;
	}
	return userTeams.map((team) => (
		<TeamCard key={team.id} team={team} tournamentAbb={team.tournamentAbbreviation} />
	));
};

export default UserTeams;
