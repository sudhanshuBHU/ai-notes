"use server";

import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';



export async function middleware(request: NextRequest) {

    const authHeader = request.headers.get('Authorization');
    console.log(authHeader);
    
    if (!authHeader) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "");
        const { payload } = await jwtVerify(token, secret);
        if (!payload) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    } catch (error) {
        console.error(error);
        return NextResponse.redirect(new URL('/', request.url));
    }
}


export const config = {
    matcher: ['/api/dashboard/create/[id]', '/api/dashboard/create'],
}