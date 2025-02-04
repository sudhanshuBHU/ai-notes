"use client";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import image from './image.png'

export default function ImageCard() {
    return (
        <div className="flex items-start gap-4">
        {/* Robot Icon */}
        <div className="relative h-24 w-24 overflow-hidden rounded-xl border bg-white shadow-sm">
          <Image
            src={image}
            alt="Robot arm icon"
            layout="fill"
            objectFit="cover"
            className="object-cover"
          />
          <button className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md">
          <Trash2 size={8} fill="black"/>
          </button>
        </div>
      </div>
    );
}
