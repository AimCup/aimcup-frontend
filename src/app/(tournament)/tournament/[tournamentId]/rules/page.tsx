import React from "react";
import { TournamentService } from "../../../../../../generated";
import { executeFetch } from "@/lib/executeFetch";
import "react-quill/dist/quill.snow.css";

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
	const tournament = await executeFetch(
		TournamentService.getTournamentByAbbreviation(params.tournamentId),
	);

	if (!tournament.status) {
		return <div>{tournament.errorMessage}</div>;
	}
	console.log(tournament.response.rules);

	return (
		<main className={"text-white container mx-auto"}>
			<section
				id="rules"
				className={
					"divide-gray-700 md:px-18 my-12 flex w-full flex-col gap-4 px-8 lg:px-20"
				}
			>
				<div className={"mb-10 flex"}>
					<div className={"flex flex-col gap-4 md:flex-row md:items-center"}>
						<h2 className={"text-4xl font-bold "}>Rules</h2>
					</div>
				</div>
				<div className={"flex flex-col gap-4 "}>
					<div
						className={`flex w-full flex-col gap-10 rounded-xl bg-tuned p-8 ${styles}`}
						dangerouslySetInnerHTML={{
							__html: tournament.response.rules || "No rules",
						}}
					/>
					{/*<div className={"flex w-full flex-col gap-2"}>*/}
					{/*	<h3 className={"text-xl font-bold"}>Topic 1</h3>*/}
					{/*	<p className={"text-base"}>*/}
					{/*		Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed*/}
					{/*		malesuada, tortor nec tincidunt tincidunt, libero nunc ullamcorper*/}
					{/*		nunc, nec interdum turpis libero a libero. Integer quis ex nec purus*/}
					{/*		lacinia ultricies. Nullam auctor, nisl vel ultricies condimentum,*/}
					{/*		purus nunc lacinia purus, nec ullamcorper libero ligula nec sapien.*/}
					{/*		Nunc id semper nunc, nec ullamcorper libero. Nullam auctor, nisl vel*/}
					{/*		ultricies condimentum, purus nunc lacinia purus, nec ullamcorper*/}
					{/*		libero ligula nec sapien. Nunc id semper nunc, nec ullamcorper*/}
					{/*		libero.*/}
					{/*	</p>*/}
					{/*</div>*/}
					{/*<div className={"flex w-full flex-col gap-2"}>*/}
					{/*	<h3 className={"text-xl font-bold"}>Topic 2</h3>*/}
					{/*	<p className={"text-base"}>*/}
					{/*		Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed*/}
					{/*		malesuada, tortor nec tincidunt tincidunt, libero nunc ullamcorper*/}
					{/*		nunc, nec interdum turpis libero a libero. Integer quis ex nec purus*/}
					{/*		lacinia ultricies. Nullam auctor, nisl vel ultricies condimentum,*/}
					{/*		purus nunc lacinia purus, nec ullamcorper libero ligula nec sapien.*/}
					{/*		Nunc id semper nunc, nec ullamcorper libero. Nullam auctor, nisl vel*/}
					{/*		ultricies condimentum, purus nunc lacinia purus, nec ullamcorper*/}
					{/*		libero ligula nec sapien. Nunc id semper nunc, nec ullamcorper*/}
					{/*		libero.*/}
					{/*	</p>*/}
					{/*</div>*/}
					{/*<div className={"flex w-full flex-col gap-2"}>*/}
					{/*	<h3 className={"text-xl font-bold"}>Topic 3</h3>*/}
					{/*	<p className={"text-base"}>*/}
					{/*		Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed*/}
					{/*		malesuada, tortor nec tincidunt tincidunt, libero nunc ullamcorper*/}
					{/*		nunc, nec interdum turpis libero a libero. Integer quis ex nec purus*/}
					{/*		lacinia ultricies. Nullam auctor, nisl vel ultricies condimentum,*/}
					{/*		purus nunc lacinia purus, nec ullamcorper libero ligula nec sapien.*/}
					{/*		Nunc id semper nunc, nec ullamcorper libero. Nullam auctor, nisl vel*/}
					{/*		ultricies condimentum, purus nunc lacinia purus, nec ullamcorper*/}
					{/*		libero ligula nec sapien. Nunc id semper nunc, nec ullamcorper*/}
					{/*		libero.*/}
					{/*	</p>*/}
					{/*</div>*/}
					{/*<div className={"flex w-full flex-col gap-2"}>*/}
					{/*	<h3 className={"text-xl font-bold"}>Topic 4</h3>*/}
					{/*	<p className={"text-base"}>*/}
					{/*		Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed*/}
					{/*		malesuada, tortor nec tincidunt tincidunt, libero nunc ullamcorper*/}
					{/*		nunc, nec interdum turpis libero a libero. Integer quis ex nec purus*/}
					{/*		lacinia ultricies. Nullam auctor, nisl vel ultricies condimentum,*/}
					{/*		purus nunc lacinia purus, nec ullamcorper libero ligula nec sapien.*/}
					{/*		Nunc id semper nunc, nec ullamcorper libero. Nullam auctor, nisl vel*/}
					{/*		ultricies condimentum, purus nunc lacinia purus, nec ullamcorper*/}
					{/*		libero ligula nec sapien. Nunc id semper nunc, nec ullamcorper*/}
					{/*		libero.*/}
					{/*	</p>*/}
					{/*</div>*/}
				</div>
			</section>
		</main>
	);
};

export default SingleTournamentRules;
