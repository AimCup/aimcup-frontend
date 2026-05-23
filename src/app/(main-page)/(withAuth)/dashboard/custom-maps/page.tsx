import { cookies } from "next/headers";
import { client, getStandaloneCustomMaps } from "../../../../../../client";
import { CustomMapsAdmin } from "./CustomMapsAdmin";

const CustomMapsAdminPage = async () => {
	const cookie = cookies().get("JWT")?.value;
	client.setConfig({
		baseUrl: process.env.NEXT_PUBLIC_API_URL,
		headers: { Cookie: `token=${cookie}` },
	});

	const { data: maps } = await getStandaloneCustomMaps();

	return (
		<div className="w-full">
			<h1 className="mb-6 text-2xl font-bold">Custom Maps</h1>
			<CustomMapsAdmin maps={maps ?? []} />
		</div>
	);
};

export default CustomMapsAdminPage;
