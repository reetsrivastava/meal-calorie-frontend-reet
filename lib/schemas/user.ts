import { z } from "zod";

export const signUpFormSchema = z
	.object({
		firstName: z.string().min(2, "First name must be at least 2 chars"),
		lastName: z.string().min(2, "Last name must be at least 2 chars"),
		email: z.string().email("Enter a valid email"),
		password: z.string().min(8, "Password must be at least 8 chars"),
		confirmPassword: z.string().min(8, "Password must be at least 8 chars"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ["confirmPassword"],
		message: "Passwords must match",
	});

export const loginFormSchema = z.object({
	email: z.string().email("Enter a valid email"),
	password: z.string().min(8, "Password must be at least 8 chars"),
});

export type SignUpFormValues = z.infer<typeof signUpFormSchema>;
export type LoginFormValues = z.infer<typeof loginFormSchema>;
