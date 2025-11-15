"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/stores/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogOut, History } from "lucide-react";

export function Header() {
	const router = useRouter();
	const token = useAuthStore((s) => s.token);
	const user = useAuthStore((s) => s.user);
	const clearToken = useAuthStore((s) => s.clearToken);
	const [isProfileOpen, setIsProfileOpen] = React.useState(false);
	const profileRef = React.useRef<HTMLDivElement>(null);



	const getInitials = () => {
		if (user?.firstName && user?.lastName) {
			return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
		}
		if (user?.email) {
			const emailPart = user.email.split("@")[0];
			if (emailPart.length >= 2) {
				return emailPart.substring(0, 2).toUpperCase();
			}
			return emailPart[0].toUpperCase();
		}
		return "U";
	};

	const getFullName = () => {
		if (user?.firstName && user?.lastName) {
			return `${user.firstName} ${user.lastName}`;
		}
		if (user?.email) {
			return user.email;
		}
		return "User";
	};

	const handleLogout = () => {
		clearToken();
		setIsProfileOpen(false);
		router.push("/");
	};

	React.useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				profileRef.current &&
				!profileRef.current.contains(event.target as Node)
			) {
				setIsProfileOpen(false);
			}
		};

		if (isProfileOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isProfileOpen]);

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto flex items-center justify-between px-4 py-4">
				<button
					onClick={() => router.push("/")}
					className="flex items-center gap-2 hover:opacity-80 transition-opacity"
				>
					<div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-lg">
						C
					</div>
					<span className="text-xl font-bold">CaloWise</span>
				</button>

				<div className="flex items-center gap-2">
					<ThemeToggle />
					{token ? (
						<div className="relative" ref={profileRef}>
							<button
								onClick={() => setIsProfileOpen(!isProfileOpen)}
								className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-semibold text-sm"
								aria-label="Profile menu"
							>
								{getInitials()}
							</button>
							{isProfileOpen && (
								<div className="absolute right-0 mt-2 w-48 rounded-md border bg-popover shadow-lg z-50">
									<div className="p-2">
										<div className="px-2 py-1.5 text-sm font-semibold">
											{getFullName()}
										</div>
										<div className="h-px bg-border my-1" />
										<button
											onClick={() => {
												router.push("/dashboard");
												setIsProfileOpen(false);
											}}
											className="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors"
										>
											Dashboard
										</button>
										<button
											onClick={() => {
												router.push("/history");
												setIsProfileOpen(false);
											}}
											className="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2"
										>
											<History className="h-4 w-4" />
											History
										</button>
										<button
											onClick={handleLogout}
											className="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2 text-destructive"
										>
											<LogOut className="h-4 w-4" />
											Logout
										</button>
									</div>
								</div>
							)}
						</div>
					) : (
						<div className="flex items-center gap-2">
							<Button
								onClick={() => router.push("/login")}
								variant="ghost"
							>
								Login
							</Button>
							<Button onClick={() => router.push("/register")}>
								Sign Up
							</Button>
						</div>
					)}
				</div>
			</div>
		</header>
	);
}

