"use client";

import { Note } from "@/types/dataTypes";
import { Copy, MoreHorizontal, ImageIcon, Play, TypeOutline } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";
interface NoteCardProps {
    title: string
    timestamp: string
    content: string
    duration?: string
    type: string
    imageCount?: number
    openModal: () => void;
    noteId?: string;
    setDataset: Dispatch<SetStateAction<Note[]>>;
}

export function NoteCard({ title, timestamp, content, duration, type, imageCount, openModal, noteId, setDataset }: NoteCardProps) {
    const maxContentSize = 250;
    let newContent = content;
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleOpen = () => {
        openModal();
        setIsPopupOpen(false);
    }

    // deleting note
    const handleDelete = async () => {
        setLoading(true);
        const token = localStorage.getItem('tars_token');
        await fetch(`${process.env.BASE_URL}/api/dashboard`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ noteId })
        })
            .then(() => toast.success('Note deleted successfully'))
            .catch(err => {
                toast.error('An error occurred while deleting the note');
                console.log(err);
            });

        // update the dataset
        const userId = localStorage.getItem('tars_userId') || '';
        fetch(`${process.env.BASE_URL}/api/dashboard`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'userId': userId,
                'Authorization': `Bearer ${token}`
            }
        }).then(res => res.json()).then(data => {
            // console.log(data);
            setDataset(data.notes);
        });
        setLoading(false);
        setIsPopupOpen(false);
    }

    if (content.length > maxContentSize) {
        newContent = content.slice(0, maxContentSize) + '...';
    }
    return (
        <div className="w-80 h-80 border border-slate-200 p-6 rounded-lg flex justify-between flex-col">
            <div onClick={openModal} className="cursor-pointer">
                <div className="">
                    <div className="">
                        <div className="flex justify-between">
                            {/* date and time formate */}
                            <p className="text-sm text-gray-500">{new Date(timestamp).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}</p>  <div className="flex justify-center items-center gap-1 rounded-full bg-gray-200 pl-2 pr-2">
                                {type !== "text" ? <>
                                    <Play size={12} color="black" fill="black" />
                                    <span className="text-xs text-muted-foreground">{duration}</span>
                                </> :
                                    <>
                                        <TypeOutline size={12} fill="black" />
                                        <span className="text-xs">Text</span>
                                    </>
                                }

                            </div>
                        </div>
                        <h3 className="font-medium mt-4">{title}</h3>
                    </div>

                </div>
                <div className="space-y-2 mt-2">
                    <p className="text-sm">{newContent}</p>
                    <div className="">
                        {imageCount !== 0 && (
                            <div className="flex items-center gap-1 text-xs mt-5">
                                <ImageIcon size={14} />
                                {imageCount} Image
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex justify-end gap-2 relative">
                <button className="h-8 w-8" onClick={() => navigator.clipboard.writeText(content)}>
                    <Copy className="h-4 w-4" />
                </button>
                <button className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" onClick={() => setIsPopupOpen(!isPopupOpen)} />
                </button>
                {isPopupOpen &&
                    <div className="absolute text-xs bottom-10">
                        <p className="cursor-pointer border rounded-full pl-2 pr-2" onClick={handleOpen}>Open</p>
                        <button className="mt-2 cursor-pointer border rounded-full pl-2 pr-2" onClick={handleDelete}>{loading ? 'Deleting...' : 'Delete'}</button>
                    </div>
                }
            </div>
        </div>
    )
}

