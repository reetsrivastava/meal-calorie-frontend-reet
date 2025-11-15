
import { getAuthToken } from "@/lib/stores/auth";

const getApiBaseUrl = (): string => {
	if (typeof window === "undefined") {
		// Server-side: use the actual backend URL
		return process.env.NEXT_PUBLIC_API_BASE_URL || "";
	}
	
	// Client-side: use Next.js API proxy to avoid CORS
	// The proxy route will forward to the actual backend
	return "/api/proxy";
};

type RequestOptions = Omit<RequestInit, "headers"> & {
	headers?: HeadersInit;
	requireAuth?: boolean; // Whether to include auth token (default: true)
};

/**
 * Secure API client that automatically includes authentication token
 * 
 * @param endpoint - API endpoint (relative or absolute)
 * @param options - Fetch options with optional requireAuth flag
 * @returns Promise<Response>
 */
export async function apiClient(
	endpoint: string,
	options: RequestOptions = {}
): Promise<Response> {
	const { requireAuth = true, headers = {}, ...fetchOptions } = options;

	const baseUrl = getApiBaseUrl();
	let url: string;
	
	if (endpoint.startsWith("http")) {
		url = endpoint;
	} else if (baseUrl) {
		const cleanBaseUrl = baseUrl.replace(/\/$/, "");
		const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
		url = `${cleanBaseUrl}${cleanEndpoint}`;
	} else {
		url = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
	}

	const requestHeaders: Record<string, string> = {};
	const method = (fetchOptions.method || options.method || "GET").toUpperCase();
	
	const methodsWithBody = ["POST", "PUT", "PATCH"];
	if (methodsWithBody.includes(method) || fetchOptions.body !== undefined) {
		requestHeaders["Content-Type"] = "application/json";
	}

	if (headers) {
		if (headers instanceof Headers) {
			headers.forEach((value, key) => {
				requestHeaders[key] = value;
			});
		} else if (Array.isArray(headers)) {
			headers.forEach(([key, value]) => {
				requestHeaders[key] = value;
			});
		} else {
			Object.assign(requestHeaders, headers);
		}
	}

	// Add Authorization header if auth is required and token exists
	if (requireAuth) {
		const token = getAuthToken();
		if (token) {
			requestHeaders["Authorization"] = `Bearer ${token}`;
		}
	}

	try {
		const fetchConfig: RequestInit = {
			...fetchOptions,
			method: fetchOptions.method || options.method || "GET",
			headers: requestHeaders,
			credentials: "include", 
			mode: "cors", // Explicitly set CORS mode
		};

		if (fetchOptions.body !== undefined) {
			fetchConfig.body = fetchOptions.body;
		}

		if (process.env.NODE_ENV === "development") {
			console.log("🌐 API Request:", {
				url,
				method: fetchConfig.method,
				headers: requestHeaders,
				hasBody: !!fetchConfig.body,
			});
		}

		const response = await fetch(url, fetchConfig);

		if (!response.ok && response.status === 0) {
			throw new Error(
				"CORS error: The backend must include CORS headers in the response. " +
				"Required headers: Access-Control-Allow-Origin, Access-Control-Allow-Credentials, " +
				"Access-Control-Allow-Headers (must include Authorization and Content-Type)"
			);
		}

		return response;
	} catch (error) {
		// Handle network/CORS errors
		if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
			throw new Error(
				"CORS error: Unable to reach the backend. " +
				"Ensure the backend allows requests from this origin and includes proper CORS headers. " +
				`Request URL: ${url}`
			);
		}
		throw error;
	}
}

export async function apiGet(endpoint: string, options?: RequestOptions) {
	return apiClient(endpoint, { ...options, method: "GET" });
}

export async function apiPost(
	endpoint: string,
	body?: unknown,
	options?: RequestOptions
) {
	return apiClient(endpoint, {
		...options,
		method: "POST",
		body: body ? JSON.stringify(body) : undefined,
	});
}
