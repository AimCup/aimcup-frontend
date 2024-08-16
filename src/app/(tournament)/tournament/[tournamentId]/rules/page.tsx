import React from "react";
import "react-quill/dist/quill.snow.css";
import { cookies } from "next/headers";
import { client, getTournamentByAbbreviation } from "../../../../../../client";
import Section from "@ui/atoms/Section/Section";

const styles =
	"[&_h1]:text-4xl " +
	"[&_h2]:text-3xl " +
	"[&_h3]:text-2xl " +
	"[&_h4]:text-xl " +
	"[&_h5]:text-lg " +
	"[&_h6]:text-base " +
	"[&_li]:ml-5 " +
	"[&_ul]:list-disc " +
	"[&_ol]:list-decimal " +
	"[&_p]:text-base ";

const SingleTournamentRules = async ({
	params,
}: {
	params: {
		tournamentId: string;
	};
}) => {
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
	const { data: tournament } = await getTournamentByAbbreviation({
		path: {
			abbreviation: params.tournamentId,
		},
	});

	return (
		<Section id="rules" className={"flex-col"}>
			<div className={"mb-10 flex"}>
				<div className={"flex flex-col gap-4 md:flex-row md:items-center"}>
					<h2 className={"text-4xl font-bold "}>Rules</h2>
				</div>
			</div>
			<div className={"flex flex-col gap-4 "}>
				<div
					className={`flex w-full flex-col rounded-xl bg-tuned p-8 ${styles}`}
					dangerouslySetInnerHTML={{
						__html: tournament?.rules || "No rules",
					}}
				/>
			</div>
		</Section>
	);
};

export default SingleTournamentRules;
