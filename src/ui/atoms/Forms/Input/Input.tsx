import React from "react";

interface IInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "required"> {
	errorMessage?: string;
	label: string;
	showAsterisk?: boolean;
}

export const Input = ({ errorMessage, ...props }: IInputProps) => {
	return (
		<div className={"flex flex-col"}>
			<label className="label" htmlFor={props.name}>
				<span className="label-text capitalize">
					{props.label} {props.showAsterisk && "*"} :
				</span>
			</label>
			<input
				{...props}
				className={`input input-bordered w-full
				${errorMessage ? "input-error" : "input-ghost focus:border-mintGreen focus:ring-mintGreen"}
				`}
			/>
			<div className="mt-1 h-4 truncate text-xs font-bold text-flatRed">{errorMessage}</div>
		</div>
	);
};
