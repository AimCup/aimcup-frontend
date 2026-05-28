import { client, getCustomBeatmaps } from "../../../../client";
import { CustomMapsClient } from "@ui/organisms/CustomMapsClient/CustomMapsClient";
import Section from "@ui/atoms/Section/Section";

const MapsPage = async () => {
	client.setConfig({
		baseUrl: process.env.NEXT_PUBLIC_API_URL,
	});

	const { data: customMaps } = await getCustomBeatmaps();

	return (
		<Section id="maps" className="flex-col">
			<div className="mb-6">
				<h2 className="text-4xl font-bold">Custom Maps</h2>
				<p className="mt-2 text-gray-400">Maps created exclusively for Aim Cup</p>
			</div>
			<CustomMapsClient maps={customMaps ?? []} />
		</Section>
	);
};

export default MapsPage;
