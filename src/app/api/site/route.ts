import { NextResponse } from "next/server";
import { SITE, PROJECTS, SERVICES } from "@/lib/site";

export const revalidate = 300;

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    {
      name: SITE.name,
      url: SITE.url,
      description: SITE.description,
      headline: SITE.headline,
      subHeadline: SITE.subHeadline,
      contactEmail: SITE.contactEmail,
      projects: PROJECTS,
      services: SERVICES,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    },
  );
}
