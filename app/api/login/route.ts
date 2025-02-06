"use server";

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../../models/User';
import connectDB from '../../../lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { email, password } = await req.json();
        // console.log(email, password);
        
        const user = await User.findOne({ email });
        // console.log(user);
        
        if (!user) {
            // console.log("Invalid credentials user not found");
            return NextResponse.json({ message: "Invalid credentials user not found" }, { status: 200 });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        // console.log(isPasswordValid);
        
        if (!isPasswordValid) {
            return NextResponse.json({ message: "Invalid credentials", status: false }, { status: 400 });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "");
        // console.log(token, user._id, user.name, user.email);
        
        return NextResponse.json({ token, user: user._id, name: user.name, email: user.email, status: true }, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ message: "Server error",error}, { status: 500 });
    }
}