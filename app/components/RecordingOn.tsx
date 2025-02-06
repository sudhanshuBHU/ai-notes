"use client";

import { Plus } from "lucide-react";
import RecordingContainer from './RecordingContainer';
import { useState } from 'react';

interface RecordingOnProps {
    closeModal: () => void;
}

export default function RecordingOn({ closeModal }: RecordingOnProps) {

    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [noteTitle, setNoteTitle] = useState("");
    const [originalText, setOriginalText] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [userData, setUserData] = useState({ userId: typeof window !== 'undefined' ? localStorage.getItem('tars_userId') : "", 
                                                token: typeof window !== 'undefined' ? localStorage.getItem('tars_token') : "",
                                                email: typeof window !== 'undefined' ? localStorage.getItem('tars_email') : "" });

    // useEffect(() => {
    //     if (typeof window !== "undefined") {
    //         const userId = localStorage.getItem("tars_userId") || '';
    //         const token = localStorage.getItem("tars_token") || '';
    //         const email = localStorage.getItem("tars_email") || '';
    //         setUserData({ userId, token, email });
    //     }
    // }, []);

    const handleSave = async () => {
        console.log("saved note: ", noteTitle, originalText, imageSrc);


        try {
            const res = await fetch(`${process.env.BASE_URL}/api/dashboard/create`, {
                method: "POST",
                body: JSON.stringify({ userId: userData.userId, noteTitle, originalText, email: userData.email }),
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${userData.token}`
                },
            });

            if (!res.ok) {
                throw new Error("Failed to save note");
            }

            const result = await res.json();
            console.log(result);
            const _id = result.savedNote._id;
            // console.log(_id);

            if (!imageFile) {
                console.log("No image file found");
                return;
            }

            const formData = new FormData();
            formData.append("image", imageFile);

            const response = await fetch(`${process.env.BASE_URL}/api/dashboard/create/${_id}`, {
                method: "PUT",
                body: formData,
                headers: {
                    "authorization": `Bearer ${userData.token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to save image");
            }

            console.log("Image saved successfully");
            closeModal();
            console.log(await response.json());


        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="p-4 pt-1 rounded-lg w-full mx-auto">
            {/* close and save btn */}
            <div className="flex justify-between">
                <button onClick={closeModal} className="text-2xl -mt-2">&times;</button>
                <button onClick={handleSave} className="text-white bg-gray-400 p-2 rounded-full pl-4 pr-4 text-sm hover:bg-gray-500">Save</button>
            </div>

            {/* heading and copy btn */}
            <div className="flex gap-2 items-center">
                <h2 className="text-gray-500 font-semibold">Record Voice or Write Note</h2>

            </div>

            {/* add title */}
            <div className="mt-4">
                <label className="block text-gray-500 font-semibold mb-2" htmlFor="noteTitle">Note Title</label>
                <input
                    type="text"
                    id="noteTitle"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="Enter your note title here"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                />
            </div>

            {/* recording container */}
            <div>
                <RecordingContainer originalText={originalText} setOriginalText={setOriginalText} />
            </div>


            {/* insert image */}
            {!imageSrc &&
                <div className="mt-4">
                    <label className="block text-gray-500 font-semibold mb-2" htmlFor="imageUpload">Insert Image</label>
                    <button className="h-24 w-24 flex flex-col justify-center items-center gap-1 rounded-xl border-dashed border-2 relative">
                        <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const imageUrl = URL.createObjectURL(file);
                                    setImageSrc(imageUrl);
                                    setImageFile(file);
                                    // console.log(imageUrl);
                                }

                            }}
                        />
                        <Plus className="h-4 w-4" />
                        <p className="text-xs font-normal">Image</p>
                    </button>
                </div>
            }

            {/* display uploaded image */}
            {imageSrc &&
                <div className="mt-4">
                    <img src={imageSrc} alt="Uploaded" className="max-w-24 max-h-24 rounded-lg" />
                </div>
            }
        </div>
    );
};