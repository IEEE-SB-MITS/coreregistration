"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import Image from 'next/image'; 
import { collection, query, where, getDocs } from 'firebase/firestore';
import db from '../../utils/config';

const Login = () => {
  const [ticketNumber, setTicketNumber] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const fetchTicketDetails = async () => {
    if (!ticketNumber || !email) {
      setError("Please enter a valid ticket number and email.");
      return;
    }

    try {
      const q = query(collection(db, "CORE"), where("ticketNumber", "==", parseInt(ticketNumber)), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        router.push(`/ticket?ticketNumber=${ticketNumber}&email=${email}`); 
      } else {
        setError("Ticket not found. Please check your ticket number and email.");
      }
    } catch (error) {
      console.error("Error fetching ticket: ", error);
      setError("An error occurred while fetching your ticket. Please try again.");
    }
  };

  return (
    <div className='flex flex-col gap-7 items-center text-white w-3/4'> 
      <div className='flex flex-col gap-5 text-[#FFFFFFE5] w-full lg:w-1/2 items-center'>
        <div className='flex flex-col w-full'>
          <label className='text-sm pl-4 py-1'>Ticket Number</label>
          <input 
            type="text" 
            className="input h-10 input-bordered border-2 px-4 border-[#E3E3E3] bg-[#57595d] placeholder:text-gray-300 rounded-md w-full" 
            value={ticketNumber}
            onChange={(e) => setTicketNumber(e.target.value)}
            placeholder="Enter ticket number"
          />
        </div>
        <div className='flex flex-col w-full'>
          <label className='text-sm pl-4 py-1'>Email</label>
          <input 
            type="email" 
            className="input h-10 input-bordered border-2 px-4 border-[#E3E3E3] bg-[#57595d] placeholder:text-gray-300 rounded-md w-full" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
      </div>

      <button
        className="btn btn-sm h-9 w-44 rounded-md text-xs text-white border border-[#505459]"
        style={{
          background: `linear-gradient(90deg, rgba(136, 158, 175, 0.8) 0%, rgba(27, 30, 32, 0.744) 98.32%)`,
        }}
        onClick={fetchTicketDetails}
      >
        DOWNLOAD TICKET
      </button>
      
      {error && <div className="text-red-500 mt-3">{error}</div>}
    </div>
  );
};

export default Login;