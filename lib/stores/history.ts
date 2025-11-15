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
	currentUserId: string | null;
	addToHistory: (item: CaloriesResponse) => void;
	clearHistory: () => void;
	removeFromHistory: (id: string) => void;
	loadUserHistory: (userId: string) => void;
	clearUserHistory: () => void;
};

const getStorageKey = (userId: string) => `meal-history-${userId}`;

const getUserHistoryFromStorage = (userId: string): MealHistoryItem[] => {
	try {
		const key = getStorageKey(userId);
		const stored = localStorage.getItem(key);
		return stored ? JSON.parse(stored).state?.history || [] : [];
	} catch {
		return [];
	}
};

const saveUserHistoryToStorage = (userId: string, history: MealHistoryItem[]) => {
	try {
		const key = getStorageKey(userId);
		localStorage.setItem(
			key,
			JSON.stringify({
				state: { history, currentUserId: userId },
				version: 0,
			})
		);
	} catch {
	}
};

export const useHistoryStore = create<HistoryState>()(
	persist(
		(set, get) => ({
			history: [],
			currentUserId: null,
			addToHistory: (item) => {
				const state = get();
				if (!state.currentUserId) {
					console.warn("Cannot add to history: no user logged in");
					return;
				}
				const historyItem: MealHistoryItem = {
					...item,
					id: Math.random().toString(36).substring(7),
					timestamp: Date.now(),
				};
				const newHistory = [historyItem, ...state.history];
				set({ history: newHistory });
				// Persist to user specific storage
				saveUserHistoryToStorage(state.currentUserId, newHistory);
			},
			clearHistory: () => {
				const state = get();
				set({ history: [] });
				if (state.currentUserId) {
					saveUserHistoryToStorage(state.currentUserId, []);
				}
			},
			removeFromHistory: (id) => {
				const state = get();
				if (!state.currentUserId) return;
				const newHistory = state.history.filter((item) => item.id !== id);
				set({ history: newHistory });
				saveUserHistoryToStorage(state.currentUserId, newHistory);
			},
			loadUserHistory: (userId: string) => {
				const history = getUserHistoryFromStorage(userId);
				set({ history, currentUserId: userId });
			},
			clearUserHistory: () => {
				set({ history: [], currentUserId: null });
			},
		}),
		{
			name: "meal-history",
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({ currentUserId: state.currentUserId }),
		}
	)
);

