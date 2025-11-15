"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CaloriesResponse } from "@/lib/schemas/calories";

export type MealHistoryItem = CaloriesResponse & {
	id: string;
	timestamp: number;
};

type HistoryState = {
	history: MealHistoryItem[];
	addToHistory: (item: CaloriesResponse) => void;
	clearHistory: () => void;
	removeFromHistory: (id: string) => void;
};

export const useHistoryStore = create<HistoryState>()(
	persist(
		(set) => ({
			history: [],
			addToHistory: (item) => {
				const historyItem: MealHistoryItem = {
					...item,
					id: Math.random().toString(36).substring(7),
					timestamp: Date.now(),
				};
				set((state) => ({
					history: [historyItem, ...state.history],
				}));
			},
			clearHistory: () => set({ history: [] }),
			removeFromHistory: (id) =>
				set((state) => ({
					history: state.history.filter((item) => item.id !== id),
				})),
		}),
		{
			name: "meal-history",
			storage: createJSONStorage(() => localStorage),
		}
	)
);

