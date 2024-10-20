"use client"
import React from 'react'
import Tickets from '../components/Tickets'
import Image from 'next/image'
import logo from '../../public/logo.png'
import CoreAnimation from '../components/CoreAnimation'

const Ticket = () => {
  return (
    <div className='w-screen min-h-screen flex quicksand-600 bg-[#171717]'>
      <div className='hidden md:block w-1/2 bg-main-bg'>
        <CoreAnimation />
      </div>
      
      <div className='flex flex-col relative w-full md:w-1/2 rounded-lg '>
      <div className='w-full flex justify-end absolute right-5 top-5 '><Image src={logo} alt='logo' width={80} height={80} /></div>
      <div className=' h-full overflow-hidden  flex items-end   '>

      <Tickets/>
      </div>
      </div>
        
    </div>
  )
}

export default Ticket