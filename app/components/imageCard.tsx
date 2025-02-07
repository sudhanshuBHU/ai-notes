"use client";
import { Note } from "@/types/dataTypes";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";


export default function ImageCard({ src, noteId, deleteIdx, noDelete, close, setDataset }: { src: string, noteId?: string, deleteIdx?: number, noDelete?: string, close?: () => void, setDataset: Dispatch<SetStateAction<Note[]>> }) {
  // console.log(src);
  // console.log(image);

  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (noDelete === 'temp') {
      if (close) {
        close();
      }
      return;
    }
    const token = localStorage.getItem('tars_token');
    console.log(noteId, deleteIdx);
    
    setLoading(true);

    await fetch(`/api/dashboard/deleteImage`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ noteId, deleteIdx })
    })
      .then(()=>{
        toast.success('Image deleted successfully');
      })
      .catch(err => {
        toast.error('An error occurred while deleting the image');
        console.log(err);
      });

      // update the dataset
    const userId = localStorage.getItem('tars_userId') || '';

      fetch(`/api/dashboard`, {
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
  }
  

  return (
    <div className="flex items-start gap-4">
      {/* Robot Icon */}
      <div className="relative h-24 w-24 overflow-hidden rounded-xl border bg-white shadow-sm">
        <Image
          src={src}
          alt="N/A"
          fill
          style={{ objectFit: 'cover' }}
          className="object-cover"
        />
        <button className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md" disabled={loading} onClick={handleDelete}>
          {loading ? 'deleting...' : <Trash2 size={10} fill="black" />}
        </button>
      </div>
    </div>
  );
}
