"use server"

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export default async function middleware(request: NextRequest) {
    const cookiesData = await cookies();
    const token = cookiesData.get("token");

    const protectedRoutes: string[] = ["/home"];
    const isProtecedRoute = protectedRoutes.includes(request.nextUrl.pathname);

    if (isProtecedRoute && !token) {
        return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
}
