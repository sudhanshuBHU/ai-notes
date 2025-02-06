"use server";

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import Data from '@/models/Data';

export async function GET(req: NextRequest) {
    try {
        await db();
        const userId = req.headers.get('userId');
        const notes = await Data.find({ userId });
        return NextResponse.json({ notes }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching notes', error }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        await db();
        const { noteId } = await req.json();
        await Data.deleteOne({ _id: noteId });
        return NextResponse.json({ message: 'Note deleted successfully' }, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ message: 'Error deleting note', error }, { status: 500 });
    }
}