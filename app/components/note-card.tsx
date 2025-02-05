
import { Copy, MoreHorizontal, ImageIcon, Play, TypeOutline } from "lucide-react";

interface NoteCardProps {
    title: string
    timestamp: string
    content: string
    duration?: string
    type: string
    imageCount?: number
    openModal: () => void;
}

export function NoteCard({ title, timestamp, content, duration, type, imageCount, openModal }: NoteCardProps) {
    const maxContentSize = 250;
    let newContent = content;
    if (content.length > maxContentSize) {
        newContent = content.slice(0, maxContentSize) + '...';
    }
    return (
        <div className="w-80 h-80 border border-slate-200 p-6 rounded-lg flex justify-between flex-col">
            <div onClick={openModal} className="cursor-pointer">
                <div className="">
                    <div className="">
                        <div className="flex justify-between">
                            <p className="text-sm text-muted-foreground">{timestamp}</p>
                            <div className="flex justify-center items-center gap-1 rounded-full bg-gray-200 pl-2 pr-2">
                                {type === "text" ? <>
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
                        {imageCount && (
                            <div className="flex items-center gap-1 text-xs mt-5">
                                <ImageIcon size={14} />
                                {imageCount} Image
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex justify-end gap-2">
                <button className="h-8 w-8" onClick={() => navigator.clipboard.writeText(content)}>
                    <Copy className="h-4 w-4" />
                </button>
                <button className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" onClick={openModal}/>
                </button>
            </div>
        </div>
    )
}

