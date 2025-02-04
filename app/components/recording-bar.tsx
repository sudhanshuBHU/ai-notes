import { Circle, ImageIcon } from "lucide-react";
// import { Button } from "@/components/ui/button"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { PencilLineIcon } from "lucide-react";

export function RecordingBar({ openModal }: { openModal: () => void }) {
    return (
        <div className="flex justify-between p-4">
            <div className="flex items-center justify-center gap-2">
                <button className="pointer-cursor" onClick={openModal}>
                    <PencilLineIcon size={14} fill="black" />
                </button>
                <button onClick={openModal} className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-lg">
                    <ImageIcon className="h-4 w-4" />
                </button>
            </div>
            <div>
                <button onClick={openModal} className="bg-red-500 hover:bg-red-600 rounded-full text-white p-3 flex justify-center align-center"><Circle fill="white" className="mt-2" size={10} /> &nbsp; <p>start recording</p></button>
            </div>
        </div>
    );
}

