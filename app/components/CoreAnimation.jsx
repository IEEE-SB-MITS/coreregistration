import Image from 'next/image';
import React from 'react';

const CoreAnimation = () => {
  return (
    <div className="w-full h-[90%] bg-black flex flex-col items-center justify-center">
      
      {/* Container with relative positioning */}
      <div className="relative flex items-center justify-center w-full h-3/4">
        
        {/* Background image (c2) */}
        <Image 
          src="/c2.png"
          layout="intrinsic" 
          width={500} 
          height={500} 
          objectFit="contain" 
          alt="Background Image 2" 
          className="absolute animate-spin-slow z-10 ml-3" // Positioned relatively below c1
          priority 
        />

        {/* Additional overlay image (c3) */}
        

        {/* Foreground image (c1) on top of the other two */}
        <Image 
          src="/c1.png" 
          layout="intrinsic" 
          width={500} 
          height={500} 
          objectFit="contain" 
          alt="Foreground Image 1" 
          className="absolute  z-0" // Positioned above both c2 and c3
          priority 
        />
      </div>
      
    </div>
  );
};

export default CoreAnimation;
