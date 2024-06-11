import React from "react";

interface ITextBoxProps {
	leftText: string;
	rightText?: string;
	icon?: React.ReactNode;
}

export const TextBox = (props: ITextBoxProps) => {
	const { leftText, rightText, icon } = props;
	return (
		<div className={"text-white flex h-10 w-full rounded-tr-md"}>
			<div className={"flex w-full items-center justify-between gap-1  bg-deepRed pl-3.5"}>
				<p className={"text-xs font-bold"}>{leftText}</p>
				<div className={"mr-1 flex items-center"}>
					<p className={"text-xs"}>{icon}</p>
					<p className={"ml-1 text-xs"}>{rightText}</p>
				</div>
			</div>
			<div className={"flex flex-col items-center"}>
				<div
					className={""}
					style={{
						height: "20px",
						width: "20px",
						backgroundColor: "#CA191B",
					}}
				></div>
				<div
					style={{
						borderBottom: "20px solid transparent",
						borderLeft: "20px solid #CA191B",
					}}
				/>
			</div>
		</div>
	);
};

//#CA191B
