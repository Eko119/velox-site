export type PersonalizationInput = {
  readonly cookies: ReadonlyMap<string, string>;
  readonly headers: Headers;
  readonly userAgent: string | null;
};

export type PersonalizationOutput = {
  readonly returningUser: boolean;
  readonly region?: string;
  readonly preferredCTA: "book" | "work";
};

export const PERSONALIZATION_DEFAULTS: PersonalizationOutput = {
  returningUser: false,
  preferredCTA: "book",
};

const RETURNING_USER_COOKIE = "velox_visited";

function fnv1a32(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash;
}

function regionFromHeaders(headers: Headers): string | undefined {
  const vercel = headers.get("x-vercel-ip-country");
  if (vercel) return vercel.toUpperCase();
  const cloudflare = headers.get("cf-ipcountry");
  if (cloudflare) return cloudflare.toUpperCase();
  return undefined;
}

export function personalize(input: PersonalizationInput): PersonalizationOutput {
  try {
    const returningUser = input.cookies.has(RETURNING_USER_COOKIE);
    const region = regionFromHeaders(input.headers);

    let preferredCTA: "book" | "work" = "book";
    if (returningUser) {
      preferredCTA = "work";
    } else if (input.userAgent && input.userAgent.length > 0) {
      preferredCTA = fnv1a32(input.userAgent) % 2 === 0 ? "book" : "work";
    }

    if (region) {
      return { returningUser, region, preferredCTA };
    }
    return { returningUser, preferredCTA };
  } catch {
    return PERSONALIZATION_DEFAULTS;
  }
}
