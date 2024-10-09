  import Image from 'next/image';
  import React from 'react';

  const CoreAnimation = () => {
    return (
      <div className="w-full h-3/4  bg-black flex flex-col items-center justify-center">
 
        {/* Container with relative positioning */}
        <div className="relative flex items-center justify-center w-full max-h-screen">
          
          {/* Background image (c2) */}
          <Image 
            src="/c2.png"
            layout="intrinsic" 
            width={600} 
            height={600} 
            objectFit="contain" 
            alt="Background Image 2" 
            className="absolute animate-spin-slow z-10" // Positioned relatively below c1
            priority 
          />

          {/* Additional overlay image (c3) */}
          

          {/* Foreground image (c1) on top of the other two */}
          <Image 
            src="/c1.png" 
            layout="intrinsic" 
            width={600} 
            height={600} 
            objectFit="contain" 
            alt="Foreground Image 1" 
            className="absolute  z-30" // Positioned above both c2 and c3
            priority 
          />
        </div>
        
      </div>
    );
  };

  export default CoreAnimation;
