import React from "react";

export interface selectOptions {
	id: string;
	label: string;
}

interface IComboBoxProps
	extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange" | "multiple" | "name"> {
	selectOptions?: selectOptions[];
	selectedOption?: selectOptions["id"][];
	onSelect?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	label: string;
	errorMessage?: string;
	name: string;
}

export const ComboBox = (props: IComboBoxProps) => {
	return (
		<div className={"flex flex-col"}>
			<label htmlFor="select" className="label">
				<span className="label-text capitalize">{props.label}:</span>
			</label>
			<select
				{...props}
				multiple={false}
				className="select select-bordered w-full focus:border-mintGreen focus:ring-mintGreen"
				onChange={props.onSelect}
			>
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
			<div className="mt-1 h-4 truncate text-xs font-bold text-flatRed">
				{props.errorMessage}
			</div>
		</div>
	);
};
