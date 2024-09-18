'use client'
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import db from '../utils/firebase.config'
import mcr from '../../public/mobile-cr.png'
import Image from "next/image";

const Tickets = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "CORE"));
        const users = [];
        querySnapshot.forEach((doc) => {
          users.push(doc.data());
        });
        console.log(users)
        setUserData(users[0])
        
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className='flex flex-col gap-4 md:gap-4 justify-center  items-center text-white w-full '>
      
      <div className='text-xl md:text-3xl py-1 border-gray-500 text-[#D9D9D9] border-b-[0.5px]'>
        TICKET DETAILS
      </div>

      <div className='bg-white w-5/6 lg:w-2/3 text-black'>
        <div className='bg-[#D9D9D9] flex justify-between py-4 px-2 lg:p-5'>
          <div className='flex flex-col gap-1 w-1/2'>
            <div className='font-bold text-xs md:text-sm'>NAME</div>
            <div className='font-semibold text-xs md:text-base'>{userData?.firstName} {userData?.lastName}</div>
          </div>

          <div className='flex flex-col items-end gap-1 w-1/2'>
            <div className='font-bold text-xs md:text-sm'>SEMESTER AND BRANCH</div>
            <div className='font-semibold text-xs md:text-base'>{userData?.branchSem}</div>
          </div>
        </div>

        <div className='border-black border-b-[1px] flex justify-between py-4 px-2 lg:p-5'>
          <div className='flex flex-col gap-1 w-1/2'>
            <div className='font-bold text-xs md:text-sm'>FOOD PREFERENCE</div>
            <div className='font-semibold text-xs md:text-base'>NON-VEG</div>
          </div>

          <div className='flex flex-col items-end gap-1 w-1/2'>
            <div className='font-bold text-xs md:text-sm'>PHONE NUMBER</div>
            <div className='font-semibold text-xs md:text-base'>{userData?.phoneNumber}</div>
          </div>
        </div>

        <div className='flex justify-between py-4 px-2 lg:p-5'>
          <div className='flex flex-col gap-1 w-1/2'>
            <div className='font-bold text-xs md:text-sm'>COLLEGE NAME</div>
            <div className='font-semibold text-xs md:text-base'>{userData?.collegeName}</div>
          </div>

          <div className='flex flex-col items-end gap-1 w-1/2'>
            <div className='font-bold text-xs md:text-sm'>IEEE MEMBERSHIP ID</div>
            <div className='font-semibold text-xs md:text-base'>{userData?.isIeeeMember ? userData.ieeeId : "-"}</div>
          </div>
        </div>

        <div className='flex py-4 px-2 lg:p-5 items-center bg-black text-white'>
          <div className='w-1/2 flex justify-center font-bold text-xs md:text-base'>VENUE</div>

          <div className='flex flex-col w-1/2'>
            <div className='font-bold text-xs md:text-base'>Muthoot Institute of</div>
            <div className='font-bold text-xs md:text-base'>Technology And Science</div>
          </div>
        </div>

        <div className='flex py-4 px-2 lg:p-5 items-center'>
          <div className='w-1/2 flex justify-end font-bold pr-6 text-xs md:text-base'>DATE AND TIME</div>

          <div className='flex flex-col  w-1/2'>
            <div className='font-bold text-xs md:text-base'>5th October 2024</div>
            <div className='font-bold text-xs md:text-base'>9 A.M. to 6 P.M.</div>
          </div>
        </div>

      </div>

      <div>
        <div
          className="btn btn-sm  h-9 w-44  rounded-full  text-white border border-[#505459]"
          style={{
            background: `linear-gradient(90deg, rgba(136, 158, 175, 0.8) 0%, rgba(27, 30, 32, 0.744) 98.32%)`,
          }}
        >
          DOWNLOAD
        </div>
      </div>


      <div className='md:hidden mb-2 '><Image src={mcr} width={211} height={95} alt='copyright'/></div>
    </div>
  )
}

export default Tickets