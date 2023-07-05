import type { Session } from "next-auth";

export async function authFetch(
    session: Session | null,
    input: RequestInfo | URL,
    init?: RequestInit
): Promise<Response> {
    if (session != null && (session as any).accessToken) {
        if (typeof init.headers === "object") {
            init.headers = {
                ...init.headers,
                Authorization: `Bearer ${(session as any).accessToken}`,
            };
        } else {
            init.headers = {
                Authorization: `Bearer ${(session as any).accessToken}`,
            };
        }
    }

    return await fetch(input, init);
}
