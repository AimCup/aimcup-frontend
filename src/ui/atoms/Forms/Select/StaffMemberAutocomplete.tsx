"use client";
import React, { useState, useEffect, useRef } from "react";
import { getStaffMembersAction } from "@/actions/public/getStaffMembersAction";

export interface selectOptions {
	id: string;
	label: string;
}

interface IStaffMemberAutocompleteProps {
	name: string;
	label: string;
	tournamentAbbreviation: string;
	selectedOption?: string[];
	errorMessage?: string;
	required?: boolean;
}

export const StaffMemberAutocomplete = ({
	name,
	label,
	tournamentAbbreviation,
	selectedOption = [],
	errorMessage,
	required = false,
}: IStaffMemberAutocompleteProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [options, setOptions] = useState<selectOptions[]>([]);
	const [loading, setLoading] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const dropdownRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const [selectedLabelsMap, setSelectedLabelsMap] = useState<Map<string, string>>(new Map());
	const [selectedIds, setSelectedIds] = useState<string[]>(selectedOption);

	// Sync with prop changes
	useEffect(() => {
		setSelectedIds(selectedOption);
	}, [selectedOption]);

	// Load data when dropdown opens or if there are selected options on mount
	useEffect(() => {
		if (selectedOption.length > 0 && options.length === 0 && !loading) {
			// Load data immediately if there are selected options
			void loadStaffMembers();
		} else if (isOpen && options.length === 0 && !loading) {
			void loadStaffMembers();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen, selectedOption.length]);

	// Update selected labels map when options are loaded
	useEffect(() => {
		if (options.length > 0) {
			const newMap = new Map<string, string>();
			options.forEach((opt) => {
				if (selectedIds.includes(opt.id)) {
					newMap.set(opt.id, opt.label);
				}
			});
			setSelectedLabelsMap(newMap);
		}
	}, [options, selectedIds]);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node;
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(target) &&
				inputRef.current &&
				!inputRef.current.contains(target)
			) {
				setIsOpen(false);
				setSearchTerm("");
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	const loadStaffMembers = async () => {
		if (loading) return; // Prevent multiple simultaneous loads
		setLoading(true);
		try {
			const staffMemberOptions = await getStaffMembersAction(tournamentAbbreviation);
			setOptions(staffMemberOptions);
		} catch (error) {
			console.error("Error loading staff members:", error);
		} finally {
			setLoading(false);
		}
	};

	const toggleSelection = (optionId: string) => {
		const newSelection = selectedIds.includes(optionId)
			? selectedIds.filter((id) => id !== optionId)
			: [...selectedIds, optionId];
		setSelectedIds(newSelection);
	};

	const filteredOptions = options.filter((option) =>
		option.label.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	// Get selected labels from map or from options
	const selectedLabels = Array.from(selectedLabelsMap.values()).join(", ") ||
		options
			.filter((opt) => selectedIds.includes(opt.id))
			.map((opt) => opt.label)
			.join(", ");

	return (
		<div className="flex flex-col">
			<label htmlFor={name} className="label">
				<span className="label-text capitalize">
					{label}
					{required && <span className="text-error"> *</span>}
				</span>
			</label>
			<div className="relative" ref={dropdownRef}>
				<input
					ref={inputRef}
					type="text"
					className="input input-bordered w-full focus:border-mintGreen focus:ring-mintGreen"
					placeholder="Select staff members..."
					value={isOpen ? searchTerm : selectedLabels || ""}
					onChange={(e) => {
						setSearchTerm(e.target.value);
						setIsOpen(true);
					}}
					onFocus={() => {
						setIsOpen(true);
						setSearchTerm("");
					}}
					onBlur={(e) => {
						// Don't close if clicking on dropdown
						if (!dropdownRef.current?.contains(e.relatedTarget as Node)) {
							setSearchTerm("");
						}
					}}
				/>
				{isOpen && (
					<div className="absolute z-50 mt-1 w-full rounded-lg border border-base-300 bg-base-100 shadow-lg">
						<div className="max-h-60 overflow-y-auto">
							{loading ? (
								<div className="p-4 text-center">
									<span className="loading loading-spinner loading-md"></span>
									<p className="mt-2 text-sm">Loading staff members...</p>
								</div>
							) : filteredOptions.length === 0 ? (
								<div className="p-4 text-center text-sm text-base-content/60">
									No staff members found
								</div>
							) : (
								filteredOptions.map((option) => {
									const isSelected = selectedIds.includes(option.id);
									return (
										<label
											key={option.id}
											className="flex cursor-pointer items-center gap-2 p-3 hover:bg-base-200"
											onClick={(e) => {
												e.preventDefault();
												toggleSelection(option.id);
											}}
										>
											<input
												type="checkbox"
												className="checkbox"
												style={{
													accentColor: "rgb(239 55 57)", // flatRed
												}}
												checked={isSelected}
												onChange={() => toggleSelection(option.id)}
												onClick={(e) => e.stopPropagation()}
											/>
											<span className="flex-1">{option.label}</span>
										</label>
									);
								})
							)}
						</div>
					</div>
				)}
			</div>
			{/* Hidden inputs for form submission */}
			{selectedIds.map((id) => (
				<input
					key={id}
					type="hidden"
					name={`${name}[]`}
					value={id}
				/>
			))}
			<div className="mt-1 h-4 truncate text-xs font-bold text-flatRed">
				{errorMessage}
			</div>
		</div>
	);
};

