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
	signUpFormSchema,
	type SignUpFormValues,
} from "@/lib/schemas/user";
import { useAuthStore } from "@/lib/stores/auth";
import { apiPost } from "@/lib/api/client";
import { useToast } from "@/components/ui/toast";
import { Alert } from "@/components/ui/alert";
import { Loader } from "@/components/ui/loader";

export default function RegisterPage() {
	const router = useRouter();
	const token = useAuthStore((s) => s.token);
	const setToken = useAuthStore((s) => s.setToken);
	const { addToast } = useToast();
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [submitError, setSubmitError] = React.useState<string | null>(null);
	const [showPassword, setShowPassword] = React.useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

	// Redirecting if logged in
	React.useEffect(() => {
		if (token) {
			router.push("/");
		}
	}, [token, router]);

	const form = useForm<SignUpFormValues>({
		resolver: zodResolver(signUpFormSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = async (values: SignUpFormValues) => {
		setSubmitError(null);
		setIsSubmitting(true);
		try {
			const response = await apiPost(
				"/auth/register",
				{
					firstName: values.firstName,
					lastName: values.lastName,
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
					.catch(() => ({ message: "Failed to register" }));
				throw new Error(errorBody?.message ?? "Failed to register");
			}

			const data: { message: string; token: string } = await response.json();
			
			if (data?.token) {
				setToken(data.token);
				
				useAuthStore.getState().setUser({
					firstName: values.firstName,
					lastName: values.lastName,
				});
			}
			
			addToast({
				type: "success",
				title: "Registration successful",
				description: "Your account has been created!",
			});
			
			router.push("/");
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Something went wrong";
			setSubmitError(message);
			addToast({
				type: "error",
				title: "Registration failed",
				description: message,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	if (token) {
		return (
			<div className="mx-auto w-full max-w-md px-4 py-10">
				<div className="flex flex-col items-center justify-center gap-4">
					<Loader size="lg" />
					<p className="text-muted-foreground">Redirecting to homepage...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto w-full max-w-md px-4 py-10">
			<h1 className="mb-6 text-2xl font-semibold">Register a New User</h1>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6"
					noValidate
				>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<FormField
							control={form.control}
							name="firstName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>First name</FormLabel>
									<FormControl>
										<Input placeholder="Jane" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="lastName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Last name</FormLabel>
									<FormControl>
										<Input placeholder="Doe" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

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

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Confirm Password</FormLabel>
									<FormControl>
										<div className="relative">
											<Input
												type={showConfirmPassword ? "text" : "password"}
												placeholder="********"
												{...field}
												className="pr-10"
											/>
											<button
												type="button"
												onClick={() => setShowConfirmPassword(!showConfirmPassword)}
												className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
												aria-label={showConfirmPassword ? "Hide password" : "Show password"}
											>
												{showConfirmPassword ? (
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
					</div>

					{submitError && (
						<Alert variant="destructive" description={submitError} />
					)}

					<Button type="submit" disabled={isSubmitting} className="w-full">
						{isSubmitting ? (
							<span className="flex items-center gap-2">
								<Loader size="sm" />
								Creating account...
							</span>
						) : (
							"Create account"
						)}
					</Button>
				</form>
			</Form>
			<div className="mt-6 text-center text-sm text-muted-foreground">
				Already have an account?{" "}
				<button
					type="button"
					onClick={() => router.push("/login")}
					className="font-medium text-primary hover:underline"
				>
					Login
				</button>
			</div>
		</div>
	);
}


