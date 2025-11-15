import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface LoaderProps {
	size?: "sm" | "md" | "lg";
	className?: string;
}

export function Loader({ size = "md", className }: LoaderProps) {
	const sizeClasses = {
		sm: "h-4 w-4",
		md: "h-6 w-6",
		lg: "h-8 w-8",
	};

	return (
		<Loader2
			className={cn("animate-spin text-primary", sizeClasses[size], className)}
		/>
	);
}

export function PageLoader({ message = "Loading..." }: { message?: string }) {
	return (
		<div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
			<Loader size="lg" />
			<p className="text-muted-foreground">{message}</p>
		</div>
	);
}

