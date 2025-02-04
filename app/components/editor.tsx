"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { Bold, Files, Heading, Italic, List, Redo, Strikethrough, Undo, Underline as UnderlineIcon } from "lucide-react";

export default function TiptapEditor({ closeEditor }: { closeEditor: () => void }) {
    const editor = useEditor({
        extensions: [StarterKit, Underline],
        content: "<p>Type here...</p>",
        editorProps: {
            attributes: {
              class: "prose h-full h-full p-2 text-gray-900",
            },
          }
    });

    if (!editor) return null;

    return (
        <div className="p-4 pt-1 rounded-lg w-full mx-auto">
            {/* close and save btn */}
            <div className="flex justify-between">
                <button onClick={closeEditor} className="text-2xl -mt-2">&times;</button>
                <button className="text-white bg-gray-400 p-2 rounded-full pl-4 pr-4 text-sm">Save</button>
            </div>
            {/* heading and copy btn */}
            <div className="flex gap-2 items-center">
                <h2 className="text-gray-500 font-semibold">Transcript</h2>
                <button>
                    <Files size={14} />
                </button>
            </div>
            {/* Editor Content */}
            <div className="p-2 rounded bg-white text-black mt-4 text-sm h-96 overflow-y-scroll">
                <EditorContent editor={editor} />
            </div>
            {/* Toolbar */}
            <div className="flex justify-center items-center mt-5">
                <div className="flex gap-4 justify-center border border-gray-300 rounded-full items-center pl-3 pr-3 p-2">
                    <button onClick={() => editor.chain().focus().toggleBold().run()} className=" rounded">
                        <Bold size={16} />
                    </button>
                    <button onClick={() => editor.chain().focus().toggleItalic().run()} className=" rounded">
                        <Italic size={16} />
                    </button>
                    <button onClick={() => editor.chain().focus().toggleUnderline().run()} className=" rounded">
                        <UnderlineIcon size={16} />
                    </button>
                    <button onClick={() => editor.chain().focus().toggleStrike().run()} className=" rounded">
                        <Strikethrough size={16} />
                    </button>
                    <button onClick={() => editor.chain().focus().toggleBulletList().run()} className=" rounded">
                        <List size={16} />
                    </button>
                    <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className=" rounded">
                        <Heading size={16} />
                    </button>
                    <button onClick={() => editor.chain().focus().undo().run()} className=" rounded">
                        <Undo size={16} />
                    </button>
                    <button onClick={() => editor.chain().focus().redo().run()} className=" rounded">
                        <Redo size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
