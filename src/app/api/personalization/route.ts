import { NextResponse, type NextRequest } from "next/server";
import { personalize, PERSONALIZATION_DEFAULTS } from "@/lib/personalization";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const cookies = new Map<string, string>();
    for (const { name, value } of request.cookies.getAll()) {
      cookies.set(name, value);
    }
    const userAgent = request.headers.get("user-agent");
    const result = personalize({ cookies, headers: request.headers, userAgent });
    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(PERSONALIZATION_DEFAULTS, {
      headers: { "Cache-Control": "no-store" },
    });
  }
}
