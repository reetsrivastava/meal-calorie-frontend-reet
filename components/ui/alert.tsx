import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";

export type AlertVariant = "default" | "destructive" | "success" | "warning";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
	variant?: AlertVariant;
	title?: string;
	description?: string;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
	({ className, variant = "default", title, description, children, ...props }, ref) => {
		const variantStyles = {
			default: "bg-muted text-muted-foreground border-border",
			destructive: "bg-red-50 border-red-200 text-red-900 dark:bg-red-950 dark:border-red-800 dark:text-red-100",
			success: "bg-green-50 border-green-200 text-green-900 dark:bg-green-950 dark:border-green-800 dark:text-green-100",
			warning: "bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-100",
		};

		const icons = {
			default: Info,
			destructive: AlertCircle,
			success: CheckCircle2,
			warning: AlertTriangle,
		};

		const Icon = icons[variant];

		return (
			<div
				ref={ref}
				role="alert"
				className={cn(
					"relative flex items-start gap-3 rounded-lg border p-4",
					variantStyles[variant],
					className
				)}
				{...props}
			>
				<Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
				<div className="flex-1">
					{title && <div className="font-semibold mb-1">{title}</div>}
					{description && <div className="text-sm">{description}</div>}
					{children}
				</div>
			</div>
		);
	}
);
Alert.displayName = "Alert";

export { Alert };

