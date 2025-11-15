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
	const [isChecking, setIsChecking] = React.useState(true);

	React.useEffect(() => {
		if (!token) {
			router.push(redirectTo);
		} else {
			setIsChecking(false);
		}
	}, [token, router, redirectTo]);

	if (isChecking || !token) {
		return (
			fallback ?? <PageLoader message="Redirecting to login..." />
		);
	}

	return <>{children}</>;
}

