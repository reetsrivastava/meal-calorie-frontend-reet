"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
	id: string;
	title?: string;
	description: string;
	type: ToastType;
	duration?: number;
}

type ToastContextType = {
	toasts: Toast[];
	addToast: (toast: Omit<Toast, "id">) => void;
	removeToast: (id: string) => void;
};

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
	const [toasts, setToasts] = React.useState<Toast[]>([]);

	const addToast = React.useCallback((toast: Omit<Toast, "id">) => {
		const id = Math.random().toString(36).substring(7);
		const newToast: Toast = { ...toast, id, duration: toast.duration ?? 5000 };
		setToasts((prev) => [...prev, newToast]);

		// Auto remove after duration
		if (newToast.duration && newToast.duration > 0) {
			setTimeout(() => {
				setToasts((prev) => prev.filter((t) => t.id !== id));
			}, newToast.duration);
		}
	}, []);

	const removeToast = React.useCallback((id: string) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);

	return (
		<ToastContext.Provider value={{ toasts, addToast, removeToast }}>
			{children}
			<ToastContainer toasts={toasts} removeToast={removeToast} />
		</ToastContext.Provider>
	);
}

export function useToast() {
	const context = React.useContext(ToastContext);
	if (!context) {
		throw new Error("useToast must be used within ToastProvider");
	}
	return context;
}

function ToastContainer({
	toasts,
	removeToast,
}: {
	toasts: Toast[];
	removeToast: (id: string) => void;
}) {
	return (
		<div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm">
			{toasts.map((toast) => (
				<ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
			))}
		</div>
	);
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
	const typeStyles = {
		success: "bg-green-50 border-green-200 text-green-900 dark:bg-green-950 dark:border-green-800 dark:text-green-100",
		error: "bg-red-50 border-red-200 text-red-900 dark:bg-red-950 dark:border-red-800 dark:text-red-100",
		info: "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-100",
		warning: "bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-100",
	};

	return (
		<div
			className={cn(
				"relative flex items-start gap-3 rounded-lg border p-4 shadow-lg transition-all",
				typeStyles[toast.type]
			)}
		>
			<div className="flex-1">
				{toast.title && (
					<div className="font-semibold mb-1">{toast.title}</div>
				)}
				<div className="text-sm">{toast.description}</div>
			</div>
			<button
				onClick={() => onRemove(toast.id)}
				className="absolute top-2 right-2 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
			>
				<X className="h-4 w-4" />
			</button>
		</div>
	);
}

