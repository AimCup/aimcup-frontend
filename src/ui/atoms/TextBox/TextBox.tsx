import React from "react";

interface ITextBoxProps {
	leftText: string;
	rightText?: string;
	icon?: React.ReactNode;
	size?: "sm" | "md" | "lg";
}

export const TextBox = (props: ITextBoxProps) => {
	const { leftText, rightText, icon, size = "md" } = props;

	let higthSize;
	if (size === "sm") {
		higthSize = "h-10";
	} else if (size === "md") {
		higthSize = "h-20";
	} else if (size === "lg") {
		higthSize = "h-32";
	}

	let fontSize;
	if (size === "sm") {
		fontSize = "text-xs";
	} else if (size === "md") {
		fontSize = "text-md";
	} else if (size === "lg") {
		fontSize = "text-lg";
	}

	let triangleSize;
	if (size === "sm") {
		triangleSize = "20px";
	} else if (size === "md") {
		triangleSize = "40px";
	} else if (size === "lg") {
		triangleSize = "60px";
	}

	return (
		<div className={`text-white flex w-full rounded-tr-md ${higthSize}`}>
			<div className={"flex w-full items-center justify-between gap-1  bg-deepRed pl-3.5 "}>
				<p className={`${fontSize} font-bold`}>{leftText}</p>
				<div className={"mr-1 flex items-center"}>
					<p className={fontSize}>{icon}</p>
					<p className={`ml-1 ${fontSize}`}>{rightText}</p>
				</div>
			</div>
			<div className={"flex flex-col items-center"}>
				<div
					className={""}
					style={{
						height: triangleSize,
						width: triangleSize,
						backgroundColor: "#CA191B",
					}}
				></div>
				<div
					style={{
						borderBottom: `${triangleSize} solid transparent`,
						borderLeft: `${triangleSize} solid #CA191B`,
					}}
				/>
			</div>
		</div>
	);
};

//#CA191B
