"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useHistoryStore } from "./history";

export type UserInfo = {
	firstName?: string;
	lastName?: string;
	email?: string;
};

type AuthState = {
	token: string | null;
	user: UserInfo | null;
	_hasHydrated: boolean;
	setToken: (token: string | null) => void;
	setUser: (user: UserInfo | null) => void;
	clearToken: () => void;
	getToken: () => string | null;
	setHasHydrated: (state: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			token: null,
			user: null,
			_hasHydrated: false,
			setToken: (token) => {
				set({ token });
				const user = get().user;
				if (user?.email && token) {
					useHistoryStore.getState().loadUserHistory(user.email);
				}
			},
			setUser: (user) => {
				set({ user });
				const token = get().token;
				if (user?.email && token) {
					useHistoryStore.getState().loadUserHistory(user.email);
				}
			},
			// Clear token and history on logout
			clearToken: () => {
				set({ token: null });
				useHistoryStore.getState().clearUserHistory();
			},
			getToken: () => get().token,
			setHasHydrated: (state) => {
				set({ _hasHydrated: state });
			},
		}),
		{
			name: "auth",
			storage: createJSONStorage(() => localStorage),
			onRehydrateStorage: () => (state) => {
				state?.setHasHydrated(true);
			},
		}
	)
);

export const getAuthToken = (): string | null => {
	return useAuthStore.getState().token;
};


