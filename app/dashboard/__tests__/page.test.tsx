import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DashboardPage from "../page";

// Mocked dependencies
vi.mock("@/lib/api/client", () => ({
	apiPost: vi.fn(),
}));

vi.mock("@/lib/stores/auth", () => ({
	useAuthStore: vi.fn(() => ({
		token: "mock-token",
		clearToken: vi.fn(),
	})),
}));

vi.mock("@/lib/stores/history", () => ({
	useHistoryStore: vi.fn(() => ({
		addToHistory: vi.fn(),
	})),
}));

vi.mock("@/components/ui/toast", () => ({
	useToast: vi.fn(() => ({
		addToast: vi.fn(),
	})),
}));

vi.mock("@/components/auth-protected", () => ({
	AuthProtected: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
}));

vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: vi.fn(),
	}),
}));

describe("DashboardPage - Form Logic", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders form with dish name and servings fields", () => {
		render(<DashboardPage />);

		expect(screen.getByPlaceholderText(/chicken salad/i)).toBeInTheDocument();
		expect(screen.getByPlaceholderText(/^2$/)).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /calculate calories/i })
		).toBeInTheDocument();
	});

	it("shows validation error when dish name is empty", async () => {
		const user = userEvent.setup();
		render(<DashboardPage />);

		const submitButton = screen.getByRole("button", {
			name: /calculate calories/i,
		});
		await user.click(submitButton);

		await waitFor(() => {
			expect(screen.getByText(/dish name is required/i)).toBeInTheDocument();
		});
	});

	it("allows user to type in dish name field", async () => {
		const user = userEvent.setup();
		render(<DashboardPage />);

		const dishNameInput = screen.getByPlaceholderText(/chicken salad/i);
		await user.type(dishNameInput, "chicken salad");

		expect(dishNameInput).toHaveValue("chicken salad");
	});

	it("shows validation error for invalid dish name characters", async () => {
		const user = userEvent.setup();
		render(<DashboardPage />);

		const dishNameInput = screen.getByPlaceholderText(/chicken salad/i);
		await user.type(dishNameInput, "chicken@salad!");

		const submitButton = screen.getByRole("button", {
			name: /calculate calories/i,
		});
		await user.click(submitButton);

		await waitFor(() => {
			expect(
				screen.getByText(/dish name can only contain/i)
			).toBeInTheDocument();
		});
	});
});
