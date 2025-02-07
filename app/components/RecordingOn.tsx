"use client";

import { Plus } from "lucide-react";
import Image from 'next/image';
import RecordingContainer from './RecordingContainer';
import { Dispatch, SetStateAction, useState } from 'react';
import { Note } from "@/types/dataTypes";
import toast from "react-hot-toast";

interface RecordingOnProps {
    closeModal: () => void;
    setDataset: Dispatch<SetStateAction<Note[]>>;
}

export default function RecordingOn({ closeModal, setDataset }: RecordingOnProps) {

    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [noteTitle, setNoteTitle] = useState("");
    const [originalText, setOriginalText] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const userData = {
        userId: typeof window !== 'undefined' ? localStorage.getItem('tars_userId') : "",
        token: typeof window !== 'undefined' ? localStorage.getItem('tars_token') : "",
        email: typeof window !== 'undefined' ? localStorage.getItem('tars_email') : ""
    };

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

        setLoading(true);
        try {
            const res = await fetch(`/api/dashboard/create`, {
                method: "POST",
                body: JSON.stringify({ userId: userData.userId, noteTitle, originalText, email: userData.email }),
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${userData.token}`
                },
            });

            if (!res.ok) {
                toast.error("Failed to save note");
                throw new Error("Failed to save note");
            }

            const result = await res.json();
            // console.log(result);
            const _id = result.savedNote._id;
            // console.log(_id);

            if (!imageFile) {
                console.log("No image file found");
                setLoading(false);
            } else {
                const formData = new FormData();
                formData.append("image", imageFile);

                const response = await fetch(`/api/dashboard/create/${_id}`, {
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
                toast.success("Note saved successfully");

                // console.log(await response.json());
            }


            // update the dataset
            // const userId = localStorage.getItem('tars_userId') || '';
            fetch(`/api/dashboard`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'userId': userData.userId || '',
                    'Authorization': `Bearer ${userData.token}`
                }
            }).then(res => res.json()).then(data => {
                // console.log(data);
                setDataset(data.notes);
            });


        } catch (error) {
            toast.error("An error occurred while saving the note");
            console.error(error);
        }
        closeModal();

        setLoading(false);

    }

    return (
        <div className="p-4 pt-1 rounded-lg w-full mx-auto">
            {/* close and save btn */}
            <div className="flex justify-between">
                <button onClick={closeModal} className="text-2xl -mt-2">&times;</button>
                <button onClick={handleSave} disabled={loading} className="text-white bg-gray-400 p-2 rounded-full pl-4 pr-4 text-sm hover:bg-gray-500">{loading ? 'Saving...' : 'Save'}</button>
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
                // <div className="mt-4">
                //     <img src={imageSrc} alt="Uploaded" className="max-w-24 max-h-24 rounded-lg" />
                // </div>
                <Image
                    src={imageSrc}
                    alt="Uploaded"
                    width={96}
                    height={96}
                    className="max-w-24 max-h-24 rounded-lg"
                />
            }
        </div>
    );
};