import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
    const token = await getToken({ req });

    const pathnames = ["/welcome", "/api/auth/signin", "/api/auth/callback/google"];

    console.log(pathnames.includes(req.nextUrl.pathname));

    // redirect logged in users from '/welcome' and from '/api/auth/signin' to '/dashboard'
    if (token && pathnames.includes(req.nextUrl.pathname)) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    //// redirect logged out users from anywhere to '/welcome'
    //if (!token && !pathnames.includes(req.nextUrl.pathname)) {
    //    return NextResponse.redirect(new URL("/welcome", req.url));
    //}

    return NextResponse.next();
}
