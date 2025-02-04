"use client";

import { Files, Plus } from "lucide-react";
import RecordingContainer from './RecordingContainer';
import { useState } from 'react';

export default function RecordingOn({ closeModal, originalText, setOriginalText }) {

    const [imageSrc, setImageSrc] = useState(null);
    // console.log(closeModal);

    return (
        <div className="p-4 pt-1 rounded-lg w-full mx-auto">
            {/* close and save btn */}
            <div className="flex justify-between">
                <button onClick={closeModal} className="text-2xl -mt-2">&times;</button>
                <button onClick={() => console.log("saved note: ", originalText)} className="text-white bg-gray-400 p-2 rounded-full pl-4 pr-4 text-sm">Save</button>
            </div>

            {/* heading and copy btn */}
            <div className="flex gap-2 items-center">
                <h2 className="text-gray-500 font-semibold">Record Voice or Write Note</h2>
                {/* copy to clipboard */}
                <button onClick={() => {
                    navigator.clipboard.writeText(originalText);
                    console.log("copied note: ", originalText);
                }}>
                    <Files size={14} />
                </button>
            </div>

            {/* add title */}
            <div className="mt-4">
                <label className="block text-gray-500 font-semibold mb-2" htmlFor="noteTitle">Note Title</label>
                <input
                    type="text"
                    id="noteTitle"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="Enter your note title here"
                    
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
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        setImageSrc(reader.result);
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                        />
                        <Plus className="h-4 w-4" />
                        <p className="text-xs font-normal">Image</p>
                    </button>
                </div>
            }

            {/* display uploaded image */}
            {imageSrc && (
                <div className="mt-4">
                    <img src={imageSrc} alt="Uploaded" className="max-w-24 max-h-24 rounded-lg" />
                </div>
            )}
        </div>
    );
}
