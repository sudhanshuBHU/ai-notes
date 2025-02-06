"use server";

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import Data from '@/models/Data';


export async function PUT(req: NextRequest) {
    try {
        await db();
        const { noteId, favorite } = await req.json();
        const note = await Data.findOneAndUpdate({ _id: noteId }, { favorite }, { new: true });
        return NextResponse.json({ note }, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ message: 'Error updating todo', error }, { status: 500 });
    }
}
