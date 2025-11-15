import { z } from "zod";

// Regex for dish_name: letters, numbers, spaces, hyphens, commas, apostrophes
const dishNameRegex = /^[a-zA-Z0-9\s\-,']+$/;

export const caloriesFormSchema = z.object({
	dish_name: z
		.string()
		.min(1, "Dish name is required")
		.max(100, "Dish name must be 100 characters or less")
		.regex(
			dishNameRegex,
			"Dish name can only contain letters, numbers, spaces, hyphens, commas, and apostrophes"
		),
	servings: z
		.number("Servings must be a number")
		.positive("Servings must be positive")
		.min(0.1, "Servings must be at least 0.1")
		.max(1000, "Servings must be 1000 or less"),
});

export type CaloriesFormValues = z.infer<typeof caloriesFormSchema>;

// API Response types
export type CaloriesResponse = {
	dish_name: string;
	servings: number;
	calories_per_serving: number;
	total_calories: number;
	source: string;
};

