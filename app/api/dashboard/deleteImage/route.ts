"use server";

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import Data from '@/models/Data';
import cloudinary from '@/lib/cloudinary';

export async function DELETE(req: NextRequest) {
    try {
        await db();
        const { noteId, deleteIdx } = await req.json();
        const note = await Data.findOne({ _id: noteId });

        if (!note) {
            return NextResponse.json({ message: 'Note not found' }, { status: 404 });
        }

        const images = note.image;

        if (deleteIdx < 0 || deleteIdx >= images.length) {
            return NextResponse.json({ message: 'Invalid image index' }, { status: 400 });
        }

        const delImage = images[deleteIdx]; // URL of the image to be deleted
        images.splice(deleteIdx, 1);

        // Extracting public ID from the Cloudinary URL
        const public_id = delImage.split('/').slice(-2).join('/').replace(/\.[^/.]+$/, ''); // Removes file extension dynamically

        // Delete image from Cloudinary (await is needed)
        const cloudinaryResponse = await cloudinary.uploader.destroy(public_id);

        if (cloudinaryResponse.result !== 'ok') {
            return NextResponse.json({ message: 'Failed to delete image from Cloudinary' }, { status: 500 });
        }

        // Update the database
        await Data.findOneAndUpdate({ _id: noteId }, { image: images }, { new: true });

        return NextResponse.json({ message: 'Image deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting image', error }, { status: 500 });
    }
}
