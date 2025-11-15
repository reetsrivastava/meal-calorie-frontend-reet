"use client";

import * as React from "react";
import { useHistoryStore } from "@/lib/stores/history";

export interface AutocompleteOption {
	value: string;
	label: string;
}

export function useDishAutocomplete(query: string) {
	const history = useHistoryStore((s) => s.history);

	const options = React.useMemo(() => {
		const uniqueDishes = new Set<string>();
		
		history.forEach((entry) => {
			if (entry.dish_name) {
				uniqueDishes.add(entry.dish_name);
			}
		});

		let allOptions: AutocompleteOption[] = Array.from(uniqueDishes).map((dish) => ({
			value: dish,
			label: dish,
		}));

		if (query.trim()) {
			const lowerQuery = query.toLowerCase();
			allOptions = allOptions.filter((opt) =>
				opt.label.toLowerCase().includes(lowerQuery)
			);
		}

		return allOptions.slice(0, 10);
	}, [history, query]);

	return { options, isLoading: false };
}

