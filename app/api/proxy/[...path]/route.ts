import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> }
) {
	const resolvedParams = await params;
	return handleRequest(request, resolvedParams, "GET");
}

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> }
) {
	const resolvedParams = await params;
	return handleRequest(request, resolvedParams, "POST");
}

async function handleRequest(
	request: NextRequest,
	params: { path: string[] },
	method: string
) {
	if (!API_BASE_URL) {
		return NextResponse.json(
			{ error: "API base URL not configured" },
			{ status: 500 }
		);
	}

	try {
		if (!params.path || !Array.isArray(params.path)) {
			return NextResponse.json(
				{ error: "Invalid path parameter" },
				{ status: 400 }
			);
		}
		
		const path = params.path.join("/");
		const url = `${API_BASE_URL.replace(/\/$/, "")}/${path}`;

		let body: string | undefined;
		if (method !== "GET" && method !== "DELETE") {
			try {
				body = await request.text();
			} catch {
			}
		}

		const headers: HeadersInit = {};
		
		const authHeader = request.headers.get("Authorization");
		if (authHeader) {
			headers["Authorization"] = authHeader;
		}

		if (body) {
			headers["Content-Type"] = "application/json";
		}

		const response = await fetch(url, {
			method,
			headers,
			body: body || undefined,
		});

		const data = await response.text();
		let jsonData;
		try {
			jsonData = JSON.parse(data);
		} catch {
			jsonData = data;
		}

		// Return the response with proper CORS headers
		return NextResponse.json(jsonData, {
			status: response.status,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type, Authorization",
			},
		});
	} catch (error) {
		console.error("Proxy error:", error);
		return NextResponse.json(
			{ error: "Failed to proxy request", message: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 }
		);
	}
}

