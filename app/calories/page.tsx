"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { CaloriesResponse } from "@/lib/schemas/calories";
import { AuthProtected } from "@/components/auth-protected";
import { PageLoader } from "@/components/ui/loader";

export default function CaloriesPage() {
	const router = useRouter();
	const [result, setResult] = React.useState<CaloriesResponse | null>(null);
	const [isLoading, setIsLoading] = React.useState(true);
	const hasLoaded = React.useRef(false);

	React.useEffect(() => {
		if (hasLoaded.current) return;
		hasLoaded.current = true;

		const storedResult = sessionStorage.getItem("caloriesResult");
		if (storedResult) {
			try {
				const parsed = JSON.parse(storedResult) as CaloriesResponse;
				setResult(parsed);
				setIsLoading(false);
				sessionStorage.removeItem("caloriesResult");
			} catch (error) {
				console.error("Error parsing stored result:", error);
				setIsLoading(false);
				router.push("/dashboard");
			}
		} else {
			// redirect to dashboard
			setIsLoading(false);
			router.push("/dashboard");
		}
	}, [router]);

	if (isLoading || !result) {
		return (
			<AuthProtected>
				<PageLoader message="Loading results..." />
			</AuthProtected>
		);
	}

	return (
		<AuthProtected>
			<div className="mx-auto w-full max-w-2xl px-4 py-10">
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-semibold">Calorie Calculation Results</h1>
				<Button onClick={() => router.push("/")} variant="outline">
					Go Home
				</Button>
			</div>

			<div className="rounded-lg border bg-card p-6 shadow-sm">
				<div className="space-y-4">
					<div className="flex items-center justify-between border-b pb-4">
						<span className="text-sm font-medium text-muted-foreground">
							Dish Name
						</span>
						<span className="text-lg font-semibold">{result.dish_name}</span>
					</div>

					<div className="flex items-center justify-between border-b pb-4">
						<span className="text-sm font-medium text-muted-foreground">
							Servings
						</span>
						<span className="text-lg font-semibold">{result.servings}</span>
					</div>

					<div className="flex items-center justify-between border-b pb-4">
						<span className="text-sm font-medium text-muted-foreground">
							Calories per Serving
						</span>
						<span className="text-lg font-semibold">
							{result.calories_per_serving.toLocaleString()} kcal
						</span>
					</div>

					<div className="flex items-center justify-between border-b pb-4">
						<span className="text-sm font-medium text-muted-foreground">
							Total Calories
						</span>
						<span className="text-2xl font-bold text-primary">
							{result.total_calories.toLocaleString()} kcal
						</span>
					</div>

					<div className="flex items-center justify-between pt-4">
						<span className="text-sm font-medium text-muted-foreground">
							Source
						</span>
						<span className="text-sm text-muted-foreground">{result.source}</span>
					</div>
				</div>
			</div>

			<div className="mt-6 flex flex-col gap-3 sm:flex-row">
				<Button
					onClick={() => router.push("/dashboard")}
					variant="outline"
					className="flex-1"
				>
					Calculate Another
				</Button>
				<Button
					onClick={() => router.push("/history")}
					className="flex-1"
				>
					View History
				</Button>
			</div>
		</div>
		</AuthProtected>
	);
}

