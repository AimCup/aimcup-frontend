"use client";
import React from "react";
import { Input } from "@ui/atoms/Forms/Input/Input";

export interface selectOptions {
	id: string;
	label: string;
}

interface IComboBoxProps
	extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange" | "name"> {
	selectOptions?: selectOptions[];
	selectedOption?: selectOptions["id"][] | undefined;
	onSelect?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	label: string;
	errorMessage?: string;
	name: string;
	readonly?: boolean;
	type?: "hidden";
}

export const ComboBox = (props: IComboBoxProps) => {
	let height = "";
	if (props.multiple) {
		height = "!h-52";
	}
	return (
		<div className={`flex flex-col ${props.type}`}>
			<label htmlFor="select" className="label">
				<span className="label-text capitalize">{props.label}:</span>
			</label>
			{props.readonly && !props.multiple ? (
				<Input label={""} name={props.name} value={props.selectedOption?.[0]} />
			) : (
				<select
					{...props}
					className={`${height} select select-bordered w-full focus:border-mintGreen focus:ring-mintGreen`}
					onChange={props.onSelect}
					name={props.multiple ? `${props.name}[]` : props.name}
				>
					{!props.multiple && (
						<option
							value={undefined}
							className={"select-option select-option-bordered"}
						/>
					)}
					{props.selectOptions?.map((option) => (
						<option
							key={option.id}
							value={option.id}
							selected={props.selectedOption?.includes(option.id)}
							className={"select-option select-option-bordered"}
						>
							{option.label}
						</option>
					)) || []}
				</select>
			)}

			<div className="mt-1 h-4 truncate text-xs font-bold text-flatRed">
				{props.errorMessage}
			</div>
		</div>
	);
};
