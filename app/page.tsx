"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingScreen from "./components/LoadingScreen";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleStart = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      router.push("/picture");
    }, 2000);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex flex-col items-center justify-around h-screen p-4">
      <Image src="/logo.svg" alt="logo" width={100} height={100} />

      <h1 className="text-8xl font-bold text-center text-black">Photo Opp</h1>

      <button 
        onClick={handleStart}
        className="bg-neutral-600 text-white px-4 py-2 rounded-sm w-full font-semibold hover:bg-neutral-700 transition-colors"
      >
        Iniciar
      </button>
    </div>
  )
}
