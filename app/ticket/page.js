import React from 'react'
import Hero from '../components/Hero'
import Tickets from '../components/Tickets'
import Image from 'next/image'
import logo from '../../public/logo.png'

const Ticket = () => {
  return (
    <div className='w-screen min-h-screen flex'>
      <div className='hidden md:block w-1/2'>
        <Hero />
      </div>
      
      <div className='flex flex-col w-full md:w-1/2 bg-black bg-opacity-90'>
      <div className='w-full flex justify-end pb-5 pt-5 pr-5'><Image src={logo} width={80} height={80} /></div>
      <Tickets/>
      </div>
        
    </div>
  )
}

export default Ticket