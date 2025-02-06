"use client";

import { ChevronUp, Home, Star } from "lucide-react";
import { SetStateAction, useState, Dispatch } from "react";
import {Note} from '@/types/dataTypes';
// interface dataType { userId: string; title: string; description: string; image: string[]; favorite: boolean; audioLength: string; timestamp: string; type: string; }

interface SidebarProps {
    dataset: Note[]
    data: Note[]
    setDataset: Dispatch<SetStateAction<Note[]>>
}

export function Sidebar({ data, setDataset }: SidebarProps) {
    const [selectedHome, setSelectedHome] = useState(true);
    const name = typeof window !== 'undefined' ? localStorage.getItem('tars_name') : '';
    const firstLetter = name ? name.charAt(0) : 'U';
    const [selected, setSelected] = useState(false);

    // handles the favorite button
    const handleFavorite = () => {
        const newData = data.filter((item) => item.favorite);
        setDataset(newData);
        setSelectedHome(false);
    }

    // handles the home button
    const handleHome = () => {
        setDataset(data);
        setSelectedHome(true);
    }

    return (
        <div className="w-60 bg-background flex flex-col h-full border rounded-lg pl-2 pr-2 ">
            {/* <div className=" border rounded-lg p-4 h-full w-full"> */}
            <div className="flex flex-col justify-between h-full">
                <div>
                    <div className="p-4 flex items-center gap-2 border-b mb-2">
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                            <span className="text-primary-foreground font-semibold bg-purple-500 pr-1 pl-1 rounded text-white">AI</span>
                        </div>
                        <span className="font-semibold">AI Notes</span>
                    </div>

                    {/* home button */}
                    <div className="flex flex-col gap-2">
                        <button className={`p-2 flex gap-2 font-semibold rounded-full text-gray-500 ${selectedHome ? 'text-purple-800 bg-gray-200' : ''}`}
                            onClick={handleHome}
                        >
                            <Home size={24} />
                            Home
                        </button>

                        {/* favorite button */}
                        <button className={`p-2 flex gap-2 font-semibold rounded-full text-gray-500 ${selectedHome ? '' : 'text-purple-800 bg-gray-200'}`}
                            onClick={handleFavorite}
                        >
                            <Star size={24} />
                            Favourites
                        </button>
                    </div>
                </div>

                <div className="pt-4 pb-4 relative" onClick={() => setSelected(!selected)}>
                    <div className="w-56 flex justify-between items-center cursor-pointer">
                        <div className="flex items-center gap-2 ">
                            <div className="h-8 w-8 rounded-full border bg-gray-800 flex items-center justify-center mr-1">
                                <span className="text-sm text-white font-medium">{firstLetter || 'U'}</span>
                            </div>
                            <div className="text-sm font-medium">
                                {name || 'User'}
                            </div>
                        </div>
                        <div>
                            <ChevronUp />
                        </div>
                    </div>
                    {selected && <div className="absolute right-0 text-red-600 rounded-lg w-40 bottom-16">
                        <ul>
                            <li><button onClick={
                                ()=>{
                                    localStorage.removeItem('tars_token');
                                    localStorage.removeItem('tars_name');
                                    localStorage.removeItem('tars_userId');
                                    localStorage.removeItem('tars_email');
                                    setSelected(false);
                                    window.location.href = '/login';
                                }
                            }>Logout</button></li>
                        </ul>
                    </div>}
                </div>
            </div>
        </div>
    )
}

