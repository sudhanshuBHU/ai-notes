"use server";

import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "../../../lib/db";
import User from "../../../models/User";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    
    try {
        const { name, email, password } = await req.json();
        // console.log(req);
        await connectMongoDB();
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }
        // console.log(email, password, name);

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({ email, password: hashedPassword, name });
        await newUser.save();

        return NextResponse.json({ message: "User created successfully", status: true }, { status: 201 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}


