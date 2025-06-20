import Image from 'next/image';

export default function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Image 
        src="/loader.svg" 
        alt="Loading" 
        width={80} 
        height={80} 
        className="mb-4 animate-spin"
      />
    </div>
  );
} 