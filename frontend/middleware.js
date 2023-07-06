import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
    const token = await getToken({ req });

    if (token?.justLoggedIn) {
        console.log("Just logged in");
        try {
            console.log("Trying to create user");
            const response = await fetch(process.env.NEXT_PUBLIC_USER_CREATION_URL, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token?.accessToken}`,
                },
            });

            // 201: Created (success), 409: Conflict (user exists)
            if (response.status !== 201 && response.status !== 409) {
                return new NextResponse(JSON.stringify({ message: "Account creation failed" }), {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                });
            } else {
                token.justLoggedIn = false;
                console.debug("Created user (or user already existed)");
                try {
                    await fetch(
                        process.env.NEXT_PUBLIC_UPDATE_LAST_LOGIN_URL?.replace(
                            ":userId",
                            token?.sub || "12345"
                        ),
                        {
                            method: "POST",
                            headers: {
                                Authorization: `Bearer ${token?.accessToken}`,
                            },
                        }
                    );
                    console.debug("Updated last log in");
                } catch {
                    // we don't really mind if the last login does not get updated
                }
            }
        } catch (err) {
            console.error("User creation failed:\n", err);
        }
    }

    const unauthPathnames = ["/welcome", "/api/auth/signin", "/api/auth/callback/google"];

    // redirect logged in users from '/welcome' and from '/api/auth/signin' to '/dashboard'
    if (token && unauthPathnames.includes(req.nextUrl.pathname)) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // redirect logged out users from anywhere to '/welcome'
    if (!token && !unauthPathnames.includes(req.nextUrl.pathname)) {
        return NextResponse.redirect(new URL("/welcome", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/welcome",
        "/dashboard",
        "/chart/create",
        "/chart/create/([^/]*)",
        "/charts",
        "/topup",
        "/api/auth/signin",
        "/api/auth/callback/google",
    ],
};
