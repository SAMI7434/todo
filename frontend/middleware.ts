import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// No-op middleware to satisfy Next.js when the file exists.
export function middleware(_request: NextRequest) {
	return NextResponse.next();
}

export const config = {
	matcher: ["/:path*"],
};
