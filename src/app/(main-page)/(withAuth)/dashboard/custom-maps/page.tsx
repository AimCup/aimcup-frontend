import { getCustomMappoolBeatmaps, getStandaloneCustomMaps } from "../../../../../../client";
import { CustomMapsAdmin } from "./CustomMapsAdmin";
import { configureApiClient } from "@/lib/guards/staffMemberGuard";

const CustomMapsAdminPage = async () => {
	configureApiClient();

	const [{ data: maps }, { data: mappoolMaps }] = await Promise.all([
		getStandaloneCustomMaps(),
		getCustomMappoolBeatmaps(),
	]);

	return (
		<div className="w-full">
			<h1 className="mb-6 text-2xl font-bold">Custom Maps</h1>
			<CustomMapsAdmin maps={maps ?? []} mappoolMaps={mappoolMaps ?? []} />
		</div>
	);
};

export default CustomMapsAdminPage;
