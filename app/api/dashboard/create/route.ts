"use server";

import { NextRequest, NextResponse } from "next/server";
import Data from '@/models/Data';
import db from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        await db();
        const { userId, noteTitle, originalText } = await req.json();
        const newNote = new Data({
            userId,
            title: noteTitle,
            description: originalText,
            completed: false,
        });
        const savedNote = await newNote.save();
        return NextResponse.json({ savedNote, status: true }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Error creating Note', error, status: false }, { status: 500 });
    }
}