import { getCustomMappoolBeatmaps, getStandaloneCustomMaps } from "../../../../../../client";
import { CustomMapsAdmin } from "./CustomMapsAdmin";
import { configureApiClient } from "@/lib/guards/staffMemberGuard";
import { PageHeader } from "@ui/molecules/PageHeader/PageHeader";

const CustomMapsAdminPage = async () => {
	configureApiClient();

	const [{ data: maps }, { data: mappoolMaps }] = await Promise.all([
		getStandaloneCustomMaps(),
		getCustomMappoolBeatmaps(),
	]);

	return (
		<div className="flex w-full flex-col gap-6">
			<PageHeader
				title="Custom Maps"
				subtitle="Manage standalone custom maps and toggle original-song status on released mappool beatmaps."
			/>
			<CustomMapsAdmin maps={maps ?? []} mappoolMaps={mappoolMaps ?? []} />
		</div>
	);
};

export default CustomMapsAdminPage;
