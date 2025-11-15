"use client";

import * as React from "react";
import { useAuthStore } from "@/lib/stores/auth";
import { useHistoryStore } from "@/lib/stores/history";

export function HistoryInitializer() {
	const token = useAuthStore((s) => s.token);
	const user = useAuthStore((s) => s.user);
	const loadUserHistory = useHistoryStore((s) => s.loadUserHistory);
	const currentUserId = useHistoryStore((s) => s.currentUserId);

	React.useEffect(() => {
		// If user is logged in and has email, but history isn't loaded yet
		if (token && user?.email && currentUserId !== user.email) {
			loadUserHistory(user.email);
		}
	}, [token, user?.email, currentUserId, loadUserHistory]);

	return null;
}

