"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useHistoryStore } from "@/lib/stores/history";
import { AuthProtected } from "@/components/auth-protected";
import { useToast } from "@/components/ui/toast";
import { Trash2, Calendar } from "lucide-react";

export default function HistoryPage() {
	const router = useRouter();
	const history = useHistoryStore((s) => s.history);
	const clearHistory = useHistoryStore((s) => s.clearHistory);
	const removeFromHistory = useHistoryStore((s) => s.removeFromHistory);
	const { addToast } = useToast();

	const formatDate = (timestamp: number) => {
		const date = new Date(timestamp);
		return date.toLocaleString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const handleClearHistory = () => {
		clearHistory();
		addToast({
			type: "success",
			title: "History cleared",
			description: "All meal history has been removed",
		});
	};

	const handleRemoveItem = (id: string) => {
		removeFromHistory(id);
		addToast({
			type: "success",
			title: "Item removed",
			description: "Meal entry has been removed from history",
		});
	};

	return (
		<AuthProtected>
			<div className="mx-auto w-full max-w-6xl px-4 py-10">
				<div className="mb-6 flex items-center justify-between">
					<div>
						<h1 className="mb-2 text-2xl font-semibold">Meal History</h1>
						<p className="text-sm text-muted-foreground">
							View your past calorie calculations
						</p>
					</div>
					{history.length > 0 && (
						<Button
							onClick={handleClearHistory}
							variant="outline"
							className="flex items-center gap-2"
						>
							<Trash2 className="h-4 w-4" />
							Clear History
						</Button>
					)}
				</div>

				{history.length === 0 ? (
					<div className="rounded-lg border bg-card p-12 text-center shadow-sm">
						<Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
						<h3 className="mb-2 text-lg font-semibold">No history yet</h3>
						<p className="mb-6 text-sm text-muted-foreground">
							Start calculating calories to see your meal history here
						</p>
						<Button onClick={() => router.push("/dashboard")}>
							Calculate Calories
						</Button>
					</div>
				) : (
					<div className="overflow-x-auto rounded-lg border bg-card shadow-sm">
						<table className="w-full">
							<thead>
								<tr className="border-b bg-muted/50">
									<th className="px-6 py-3 text-left text-sm font-semibold">
										Dish Name
									</th>
									<th className="px-6 py-3 text-left text-sm font-semibold">
										Servings
									</th>
									<th className="px-6 py-3 text-left text-sm font-semibold">
										Calories/Serving
									</th>
									<th className="px-6 py-3 text-left text-sm font-semibold">
										Total Calories
									</th>
									<th className="px-6 py-3 text-left text-sm font-semibold">
										Date
									</th>
									<th className="px-6 py-3 text-left text-sm font-semibold">
										Source
									</th>
									<th className="px-6 py-3 text-right text-sm font-semibold">
										Actions
									</th>
								</tr>
							</thead>
							<tbody>
								{history.map((item) => (
									<tr
										key={item.id}
										className="border-b transition-colors hover:bg-muted/50"
									>
										<td className="px-6 py-4 text-sm font-medium">
											{item.dish_name}
										</td>
										<td className="px-6 py-4 text-sm">{item.servings}</td>
										<td className="px-6 py-4 text-sm">
											{item.calories_per_serving.toLocaleString()} kcal
										</td>
										<td className="px-6 py-4 text-sm font-semibold">
											{item.total_calories.toLocaleString()} kcal
										</td>
										<td className="px-6 py-4 text-sm text-muted-foreground">
											{formatDate(item.timestamp)}
										</td>
										<td className="px-6 py-4 text-sm text-muted-foreground">
											{item.source}
										</td>
										<td className="px-6 py-4 text-right">
											<Button
												onClick={() => handleRemoveItem(item.id)}
												variant="ghost"
												size="sm"
												className="text-destructive hover:text-destructive"
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				<div className="mt-6 flex flex-col gap-3 sm:flex-row">
					<Button
						onClick={() => router.push("/")}
						variant="outline"
						className="flex-1"
					>
						Go Home
					</Button>
					<Button
						onClick={() => router.push("/dashboard")}
						variant="outline"
						className="flex-1"
					>
						Back to Dashboard
					</Button>
				</div>
			</div>
		</AuthProtected>
	);
}

