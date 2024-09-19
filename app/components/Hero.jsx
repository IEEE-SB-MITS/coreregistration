import Image from 'next/image';
import React from 'react';
import core from '../../public/core.png';
import cr from '../../public/cr.png'

const Hero = () => {
  return (
    <div className='w-full h-full bg-black flex flex-col items-center justify-around '>
      <div className='w-2/3'>
        <Image
          src={core} 
          width={250} 
          height={250} 
          layout="responsive"
          objectFit="contain"
          alt="Core Image"
        />
      </div>
      <div><Image src={cr} width={200} height={19} objectFit="contain" alt="Copyright"/></div>
    </div>
  )
}

export default Hero;
