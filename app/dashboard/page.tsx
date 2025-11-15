"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	caloriesFormSchema,
	type CaloriesFormValues,
	type CaloriesResponse,
} from "@/lib/schemas/calories";
import { apiPost } from "@/lib/api/client";
import { useAuthStore } from "@/lib/stores/auth";
import { useHistoryStore } from "@/lib/stores/history";
import { AuthProtected } from "@/components/auth-protected";
import { useToast } from "@/components/ui/toast";
import { Loader } from "@/components/ui/loader";

export default function DashboardPage() {
	const router = useRouter();
	const { addToast } = useToast();
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [submitError, setSubmitError] = React.useState<string | null>(null);

	const form = useForm<CaloriesFormValues>({
		resolver: zodResolver(caloriesFormSchema),
		defaultValues: {
			dish_name: "",
			servings: 1,
		},
	});

	// Clear error when user starts typing
	const dishNameValue = form.watch("dish_name");
	const servingsValue = form.watch("servings");
	
	React.useEffect(() => {
		if (submitError && (dishNameValue || servingsValue !== 1)) {
			setSubmitError(null);
		}
	}, [dishNameValue, servingsValue, submitError]);

	const onSubmit = async (values: CaloriesFormValues) => {
		setSubmitError(null);
		setIsSubmitting(true);

		try {
			const response = await apiPost("/get-calories", {
				dish_name: values.dish_name,
				servings: values.servings,
			});

			if (!response.ok) {
				let errorMessage = "Failed to get calories";

				if (response.status === 400) {
					const errorBody = await response
						.json()
						.catch(() => ({ message: "Validation failed or invalid dish name" }));
					errorMessage = errorBody?.message ?? "Validation failed or invalid dish name";
				} else if (response.status === 401) {
					// Token expired login redirect
					useAuthStore.getState().clearToken();
					router.push("/login");
					return;
				} else if (response.status === 404) {
					errorMessage = "Dish not found or no nutrition data available";
				} else if (response.status === 500) {
					errorMessage = "Server error: Unexpected error or missing calories data";
				} else {
					const errorBody = await response
						.json()
						.catch(() => ({ message: "An error occurred" }));
					errorMessage = errorBody?.message ?? "An error occurred";
				}

				throw new Error(errorMessage);
			}

			const data: CaloriesResponse = await response.json();

			// Add history
			useHistoryStore.getState().addToHistory(data);

			sessionStorage.setItem("caloriesResult", JSON.stringify(data));
			
			addToast({
				type: "success",
				title: "Calories calculated",
				description: `Found ${data.total_calories} calories for ${data.dish_name}`,
			});
			
			router.push("/calories");
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Something went wrong";
			setSubmitError(message);
			addToast({
				type: "error",
				title: "Failed to calculate calories",
				description: message,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<AuthProtected>
			<div className="mx-auto w-full max-w-md px-4 py-10">
			<h1 className="mb-6 text-2xl font-semibold">Calculate Calories</h1>
			<p className="mb-6 text-sm text-muted-foreground">
				Enter a dish name and number of servings to calculate the total calories.
			</p>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6"
					noValidate
				>
					<FormField
						control={form.control}
						name="dish_name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Dish Name</FormLabel>
								<FormControl>
									<Input
										placeholder="chicken salad"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="servings"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Servings</FormLabel>
								<FormControl>
									<Input
										type="number"
										step="0.1"
										min="0.1"
										max="1000"
										placeholder="2"
										{...field}
										onChange={(e) => {
											const value = e.target.value;
											field.onChange(value === "" ? undefined : parseFloat(value));
										}}
										value={field.value ?? ""}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" disabled={isSubmitting} className="w-full">
						{isSubmitting ? (
							<span className="flex items-center gap-2">
								<Loader size="sm" />
								Calculating...
							</span>
						) : (
							"Calculate Calories"
						)}
					</Button>
				</form>
			</Form>
			
			<div className="mt-6 flex flex-col gap-3 sm:flex-row">
				<Button
					onClick={() => router.push("/")}
					variant="outline"
					className="flex-1"
				>
					Go Home
				</Button>
				<Button
					onClick={() => router.push("/history")}
					variant="outline"
					className="flex-1"
				>
					View History
				</Button>
			</div>
		</div>
		</AuthProtected>
	);
}

