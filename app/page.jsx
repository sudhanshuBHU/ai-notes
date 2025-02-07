"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function app() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('tars_userId');
      const token = localStorage.getItem('tars_token');
      if (user && token) {
        toast.success('Welcome back!');
        router.push('/dashboard');
      } else{
        toast.error('You need to login to access this page');
        router.push('/login');
      }
    }
  });

  return (
    <div className="flex flex-col items-center mt-8 h-screen">
      <h1 className="text-4xl font-bold mb-4"><b>Welcome To AI Note</b></h1>
      <h3 className="text-xl">Redirecting...</h3>
    </div>
  )
}











