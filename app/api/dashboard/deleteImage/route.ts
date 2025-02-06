"use server";

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import Data from '@/models/Data';


export async function DELETE(req: NextRequest) {
    try {
        await db();
        const { noteId, deleteIdx } = await req.json();
        // console.log(noteId, deleteIdx);
        const note = await Data.findOne({ _id: noteId });
        console.log(note);
        const images = note.image;
        console.log(images);
        images.splice(deleteIdx, 1);
        console.log(images);
        await Data.findOneAndUpdate({ _id: noteId }, { image: images }, { new: true });
        return NextResponse.json({ message: 'Image deleted successfully' }, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ message: 'Error deleting note', error }, { status: 500 });
    }
}