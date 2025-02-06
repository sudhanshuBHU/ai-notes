"use client";
import { Trash2 } from "lucide-react";
import Image from "next/image";


export default function ImageCard({ src, noteId, deleteIdx, noDelete, close }: { src: string, noteId?: string, deleteIdx?: number, noDelete?: string, close?: () => void }) {
  // console.log(src);
  // console.log(image);

  const handleDelete = async () => {
    if (noDelete === 'temp') {
      if (close) {
        close();
      }
      return;
    }
    const token = localStorage.getItem('tars_token');
    console.log(noteId, deleteIdx);
    
    await fetch('/api/dashboard/deleteImage', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ noteId, deleteIdx })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        console.log(err);
      });
  }

  return (
    <div className="flex items-start gap-4">
      {/* Robot Icon */}
      <div className="relative h-24 w-24 overflow-hidden rounded-xl border bg-white shadow-sm">
        <Image
          src={src}
          alt="Robot arm icon"
          layout="fill"
          objectFit="cover"
          className="object-cover"
        />
        <button className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md" onClick={handleDelete}>
          <Trash2 size={10} fill="black" />
        </button>
      </div>
    </div>
  );
}
