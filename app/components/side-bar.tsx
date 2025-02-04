"use client";

import { Home, Star } from "lucide-react";
import { useState } from "react";

export function Sidebar() {
    // if (typeof window !== 'undefined') return;
    const [selectedHome, setSelectedHome] = useState(true);
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

                    <div className="flex flex-col gap-2">
                        <button className={`p-2 border flex gap-2 font-semibold rounded-full text-gray-500 ${selectedHome ? 'text-purple-800 bg-gray-200' : ''}`}
                            onClick={() => setSelectedHome(true)}
                        >
                            <Home size={24} />
                            Home
                        </button>
                        <button className={`p-2 flex gap-2 font-semibold rounded-full text-gray-500 ${selectedHome ? '' : 'text-purple-800 bg-gray-200'}`}
                            onClick={() => setSelectedHome(false)}
                        >
                            <Star size={24} />
                            Favourites
                        </button>
                    </div>
                </div>

                <div className="pt-4 pb-4 flex items-center ">
                    <div className="h-8 w-8 rounded-full border bg-gray-800 flex items-center justify-center mr-1">
                        <span className="text-sm text-white font-medium">E</span>
                    </div>
                    <select name="" id="" className="w-44">
                        <option value="" className="text-sm font-medium">
                            Emmanual Vincent
                        </option>
                    </select>
                </div>
            </div>
        </div>
    )
}

