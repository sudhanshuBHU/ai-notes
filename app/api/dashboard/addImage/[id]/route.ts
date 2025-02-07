"use server";

import db from "@/lib/db";
import Data from "@/models/Data";
import { NextRequest, NextResponse } from "next/server";
import UploadImage from "@/lib/uploadImage";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await db();

        const formData = await req.formData();
        const file = formData.get("image");

        if (!file || !(file instanceof Blob)) {
            return NextResponse.json({ message: "No file uploaded or invalid file" }, { status: 400 });
        }

        // upload the image
        const uploadResult = await UploadImage(file, "tars"); // returns URL

        // Read file contents
        // const buffer = Buffer.from(await file.arrayBuffer());
        // const filename = `${Date.now()}-${file.name}`;
        // const path = `./uploads/${filename}`;
        // await writeFile(path, buffer);

        const { id } = await params;

        // Update the filename in the database
        const note = await Data.findByIdAndUpdate(id, { $push: { image: uploadResult } }, { new: true });

        if (note) {
            return NextResponse.json(note, { status: 200 });
        } else {
            return NextResponse.json({ message: "Data not found" }, { status: 404 });
        }
    } catch (error) {
        return NextResponse.json({ message: "Error updating data", error: error }, { status: 500 });
    }
}
