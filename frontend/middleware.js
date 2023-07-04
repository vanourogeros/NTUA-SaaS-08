import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
    const token = await getToken({ req });

    // redirect logged in users from '/welcome' and from '/api/auth/signin' to '/dashboard'
    if (
        req.nextUrl.pathname === "/welcome" ||
        (req.nextUrl.pathname === "/api/auth/signin" && token)
    ) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // redirect logged out users from anywhere to '/welcome'
    if (!token) {
        return NextResponse.redirect(new URL("/welcome", req.url));
    }

    return NextResponse.next();
}
