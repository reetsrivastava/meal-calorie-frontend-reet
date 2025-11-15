"use client";

import * as React from "react";
import { Input } from "./input";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AutocompleteOption {
	value: string;
	label: string;
}

interface AutocompleteProps {
	options: AutocompleteOption[];
	value: string;
	onChange: (value: string) => void;
	onSelect?: (option: AutocompleteOption) => void;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
}

export function Autocomplete({
	options,
	value,
	onChange,
	onSelect,
	placeholder,
	disabled = false,
	className,
}: AutocompleteProps) {
	const [isOpen, setIsOpen] = React.useState(false);
	const [focusedIndex, setFocusedIndex] = React.useState(-1);
	const inputRef = React.useRef<HTMLInputElement>(null);
	const listRef = React.useRef<HTMLUListElement>(null);

	const filteredOptions = options;

	React.useEffect(() => {
		if (isOpen && filteredOptions.length > 0) {
			setFocusedIndex(0);
		} else if (isOpen && filteredOptions.length === 0) {
			setFocusedIndex(-1);
		}
	}, [isOpen, filteredOptions.length]);

	const handleSelect = (option: AutocompleteOption) => {
		onChange(option.value);
		onSelect?.(option);
		setIsOpen(false);
		inputRef.current?.blur();
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (disabled) return;

		switch (e.key) {
			case "ArrowDown":
				e.preventDefault();
				if (!isOpen && filteredOptions.length > 0) {
					setIsOpen(true);
				} else {
					setFocusedIndex((prev) =>
						prev < filteredOptions.length - 1 ? prev + 1 : prev
					);
				}
				break;
			case "ArrowUp":
				e.preventDefault();
				if (focusedIndex > 0) {
					setFocusedIndex((prev) => prev - 1);
				}
				break;
			case "Enter":
				e.preventDefault();
				if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
					handleSelect(filteredOptions[focusedIndex]);
				}
				break;
			case "Escape":
				setIsOpen(false);
				inputRef.current?.blur();
				break;
		}
	};

	React.useEffect(() => {
		if (focusedIndex >= 0 && listRef.current) {
			const focusedElement = listRef.current.children[focusedIndex] as HTMLElement;
			if (focusedElement) {
				focusedElement.scrollIntoView({ block: "nearest" });
			}
		}
	}, [focusedIndex]);

	React.useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				inputRef.current &&
				!inputRef.current.contains(event.target as Node) &&
				listRef.current &&
				!listRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div className={cn("relative w-full", className)}>
			<div className="relative">
				<Input
					ref={inputRef}
					value={value}
					onChange={(e) => {
						onChange(e.target.value);
						if (options.length > 0) {
							setIsOpen(true);
						}
					}}
					onFocus={() => {
						if (options.length > 0) {
							setIsOpen(true);
						}
					}}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					disabled={disabled}
					className="pr-10"
				/>
				<div className="absolute right-3 top-1/2 -translate-y-1/2">
					<ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
				</div>
			</div>

			{isOpen && filteredOptions.length > 0 && (
				<ul
					ref={listRef}
					className="absolute z-[100] mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover py-1 text-sm shadow-md"
					role="listbox"
				>
					{filteredOptions.map((option, index) => (
						<li
							key={option.value}
							className={cn(
								"relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
								focusedIndex === index
									? "bg-accent text-accent-foreground"
									: "hover:bg-accent hover:text-accent-foreground"
							)}
							onClick={() => handleSelect(option)}
							onMouseEnter={() => setFocusedIndex(index)}
							role="option"
							aria-selected={focusedIndex === index}
						>
							<Check
								className={cn(
									"mr-2 h-4 w-4",
									value === option.value ? "opacity-100" : "opacity-0"
								)}
							/>
							{option.label}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

