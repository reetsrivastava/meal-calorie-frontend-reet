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
import { Eye, EyeOff } from "lucide-react";
import {
	loginFormSchema,
	type LoginFormValues,
} from "@/lib/schemas/user";
import { useAuthStore } from "@/lib/stores/auth";
import { apiPost } from "@/lib/api/client";
import { useToast } from "@/components/ui/toast";
import { Alert } from "@/components/ui/alert";
import { Loader } from "@/components/ui/loader";

export default function LoginPage() {
	const router = useRouter();
	const token = useAuthStore((s) => s.token);
	const hasHydrated = useAuthStore((s) => s._hasHydrated);
	const setToken = useAuthStore((s) => s.setToken);
	const { addToast } = useToast();
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [submitError, setSubmitError] = React.useState<string | null>(null);
	const [showPassword, setShowPassword] = React.useState(false);

	// Redirecting if logged in (wait for hydration first)
	React.useEffect(() => {
		if (hasHydrated && token) {
			router.push("/");
		}
	}, [token, hasHydrated, router]);

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (values: LoginFormValues) => {
		setSubmitError(null);
		setIsSubmitting(true);
		try {
			const response = await apiPost(
				"/auth/login",
				{
					email: values.email,
					password: values.password,
				},
				{
					requireAuth: false,
				}
			);

			if (!response.ok) {
				const errorBody = await response
					.json()
					.catch(() => ({ message: "Failed to login" }));
				throw new Error(errorBody?.message ?? "Failed to login");
			}

			const data: { token: string; firstName?: string; lastName?: string; user?: { firstName: string; lastName: string } } = await response.json();
			
			if (data?.token) {
				const firstName = data.firstName || data.user?.firstName;
				const lastName = data.lastName || data.user?.lastName;
				
				const userInfo = {
					email: values.email,
					...(firstName && lastName ? { firstName, lastName } : {}),
				};
				
				useAuthStore.getState().setUser(userInfo);
				setToken(data.token);
			}
			
			addToast({
				type: "success",
				title: "Login successful",
				description: "Welcome back!",
			});
			
			router.push("/");
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Something went wrong";
			setSubmitError(message);
			addToast({
				type: "error",
				title: "Login failed",
				description: message,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!hasHydrated || (hasHydrated && token)) {
		return (
			<div className="mx-auto w-full max-w-md px-4 py-10">
				<div className="flex flex-col items-center justify-center gap-4">
					<Loader size="lg" />
					<p className="text-muted-foreground">
						{!hasHydrated ? "Loading..." : "Redirecting to homepage..."}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto w-full max-w-md px-4 py-10">
			<h1 className="mb-6 text-2xl font-semibold">Login</h1>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6"
					noValidate
				>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input type="email" placeholder="jane@example.com" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<div className="relative">
										<Input
											type={showPassword ? "text" : "password"}
											placeholder="********"
											{...field}
											className="pr-10"
										/>
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
											aria-label={showPassword ? "Hide password" : "Show password"}
										>
											{showPassword ? (
												<EyeOff className="h-4 w-4" />
											) : (
												<Eye className="h-4 w-4" />
											)}
										</button>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{submitError && (
						<Alert variant="destructive" description={submitError} />
					)}

					<Button type="submit" disabled={isSubmitting} className="w-full">
						{isSubmitting ? (
							<span className="flex items-center gap-2">
								<Loader size="sm" />
								Logging in...
							</span>
						) : (
							"Login"
						)}
					</Button>
				</form>
			</Form>
			<div className="mt-6 text-center text-sm text-muted-foreground">
				Don&apos;t have an account?{" "}
				<button
					type="button"
					onClick={() => router.push("/register")}
					className="font-medium text-primary hover:underline"
				>
					Sign up
				</button>
			</div>
		</div>
	);
}

