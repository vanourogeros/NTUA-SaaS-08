import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
    const token = await getToken({ req });

    // remove "if" to make it work
    if (false) {
        // redirect logged in users from '/' to '/dashboard'
        if (req.nextUrl.pathname === "/" && token) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        // redirect logged out users from '/dashboard' to '/'
        if (req.nextUrl.pathname === "/dashboard" && !token) {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/dashboard", "/api/auth/signin"],
};
