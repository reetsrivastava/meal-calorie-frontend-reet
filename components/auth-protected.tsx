"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth";
import { PageLoader } from "@/components/ui/loader";

type AuthProtectedProps = {
	children: React.ReactNode;
	redirectTo?: string;
	fallback?: React.ReactNode;
};


// Redirects to login if no token is found
export function AuthProtected({
	children,
	redirectTo = "/login",
	fallback,
}: AuthProtectedProps) {
	const router = useRouter();
	const token = useAuthStore((s) => s.token);
	const hasHydrated = useAuthStore((s) => s._hasHydrated);
	const [isChecking, setIsChecking] = React.useState(true);

	React.useEffect(() => {
		// Wait for Zustand persist to hydrate before checking token
		if (!hasHydrated) {
			return;
		}

		if (!token) {
			router.push(redirectTo);
		} else {
			setIsChecking(false);
		}
	}, [token, hasHydrated, router, redirectTo]);

	// Show loader while waiting for hydration or checking auth
	if (!hasHydrated || isChecking || !token) {
		return (
			fallback ?? <PageLoader message="Loading..." />
		);
	}

	return <>{children}</>;
}

