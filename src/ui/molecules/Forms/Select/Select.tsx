"use client";
import React from "react";

interface Option {
	value: string;
	label: string;
}

interface SingleSelectProps {
	options: Option[];
	defaultValue?: string;
	onChange?: (value: string) => void;
}

const SingleSelect: React.FC<SingleSelectProps> = ({
	options,
	defaultValue,
	onChange = () => {
		// do nothing
	},
}) => {
	const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		onChange(event.target.value);
	};

	return (
		<select
			className="select select-bordered w-full max-w-xs"
			defaultValue={defaultValue}
			onChange={handleChange}
		>
			<option disabled value="">
				Select team
			</option>
			{options.map((option) => (
				<option key={option.value} value={option.value}>
					{option.label}
				</option>
			))}
		</select>
	);
};

export default SingleSelect;
