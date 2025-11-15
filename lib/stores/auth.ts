"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type UserInfo = {
	firstName?: string;
	lastName?: string;
	email?: string;
};

type AuthState = {
	token: string | null;
	user: UserInfo | null;
	setToken: (token: string | null) => void;
	setUser: (user: UserInfo | null) => void;
	clearToken: () => void;
	getToken: () => string | null;
};

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			token: null,
			user: null,
			setToken: (token) => set({ token }),
			setUser: (user) => set({ user }),
			// Only clear token on logout, keep user info for next login
			clearToken: () => set({ token: null }),
			getToken: () => get().token,
		}),
		{
			name: "auth",
			storage: createJSONStorage(() => localStorage),
		}
	)
);

export const getAuthToken = (): string | null => {
	return useAuthStore.getState().token;
};


