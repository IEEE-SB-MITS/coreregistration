import Image from 'next/image';
import React from 'react';
import c1 from '../../public/c1.png';
import c2 from '../../public/c2.png';

const Hero = () => {
  return (
    <div className="w-full h-3/4 bg-black flex flex-col items-center justify-center">
      
      {/* Container with relative positioning */}
      <div className="relative flex items-center justify-center w-full h-auto">
        
        {/* Background image (c2) */}
        <Image 
          src={c2} 
          layout="intrinsic" 
          width={600} 
          height={600} 
          objectFit="contain" 
          alt="Background Image 2" 
          className="absolute animate-spin-slow z-10 " // Positioned relatively below c1
          priority 
        />

        {/* Additional overlay image (c3) */}
        

        {/* Foreground image (c1) on top of the other two */}
        <Image 
          src={c1} 
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

export default Hero;
