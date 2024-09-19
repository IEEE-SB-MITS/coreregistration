'use client'
import React, { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import db from '../utils/firebase.config.js';
import Image from "next/image";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    collegeName: '',
    branchSem: '',
    isIeeeMember: true,
    ieeeId: '',
    transcationid: '',
  });

  const [showDetails, setShowDetails] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isMember, setIsMember]  = useState(true);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    if (name === "phoneNumber") {
      setFormData((prevData) => ({
        ...prevData,
        phoneNumber: "+91 " + value.replace("+91 ", ""), 
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: fieldValue,
      }));
    }

    if(name==='isIeeeMember'){
      setIsMember(value === 'true');
    }
  };

  async function addData(firstName, lastName, phoneNumber, email, collegeName, branchSem, isIeeeMember, ieeeId,transcationid) {
    try {
      const docRef = await addDoc(collection(db, "CORE"), {
        firstName,
        lastName,
        phoneNumber,
        email,
        collegeName,
        branchSem,
        isIeeeMember,
        ieeeId,
        transcationid,
      });
      console.log("Document written with ID: ", docRef.id);
      return true;
    } catch (error) {
      console.error("Error adding document: ", error);
      return false;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, phoneNumber, email, collegeName, branchSem, isIeeeMember, ieeeId, transcationid } = formData;

    if (!firstName || !lastName || !phoneNumber || !email || !collegeName || !branchSem || (isMember && !ieeeId)) {
      console.log('fill in all the fields');
      return;
    }
  
    const phoneRegex = /^\d{10}$/;
    const pn = phoneNumber.replace("+91 ", "");
    if (!phoneRegex.test(pn)) {
      console.log('enter a valid 10-digit phone number');
      return;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('enter a valid email address');
      return;
    }
    if (!showDetails) {
      setIsSubmitted(true);
    } else {
      console.log('Error adding data');
    }
  };

  const handleSubmit1 = async (e) => {
    e.preventDefault();
    const { firstName, lastName, phoneNumber, email, collegeName, branchSem, isIeeeMember, ieeeId, transcationid } = formData;
    const success = await addData(firstName, lastName, phoneNumber, email, collegeName, branchSem, isIeeeMember, ieeeId, transcationid);
    if (success) {
    console.log('Data added successfully');
    } else {
      console.log('Error adding data');
    }
  };
  
  useEffect(() => {
    if (isSubmitted) {
      setShowDetails(true);
    }
  }, [isSubmitted]);

  return (
    <div className='text-white flex flex-col gap-7 items-center relative w-3/4'>
      {showDetails ? (
        <div className='w-full flex flex-col items-center'>
          <div className='text-3xl font-semibold pb-2 text-[#FFFFFFD9]'>Scan the QR code</div>
          <div className='flex flex-col justify-center gap-3 text-[#FFFFFFE5]'>
            <div className='flex flex-col justify-center items-center '>
              <Image src="" width="80" height="90" />
            </div>
            <div className='flex flex-col justify-center  '>

            <label className='text-sm pl-4 py-1'>Transcation Id</label>
            <input type="text" name="transcationid" value={formData.transcationid} onChange={handleChange} className="input h-10 input-bordered border-2 border-white bg-[#57595d] rounded-full w-full" />
            
            
            </div>
            <div className='flex flex-col justify-center  items-center '>

            <button
              className="btn btn-sm h-9 w-44 flex rounded-full text-white border border-[#505459]"
              style={{
                background: `linear-gradient(90deg, rgba(136, 158, 175, 0.8) 0%, rgba(27, 30, 32, 0.744) 98.32%)`,
              }}
              onClick={handleSubmit1}
            >
              Sign Up
            </button>
           </div>
          </div>
        </div>
      ) : (
        <>
          <div className='w-full'>
            <div className='text-3xl font-semibold pb-2 text-[#FFFFFFD9]'>Student Details</div>
            <div className='flex flex-col gap-3 text-[#FFFFFFE5]'>
              <div className='flex flex-col lg:flex-row gap-3 lg:gap-10'>
                <div className='flex flex-col lg:w-1/2'>
                  <label className='block'>
                  <span class="after:content-['*'] after:ml-0.5 after:text-red-700 block text-sm pl-4 py-1">First Name</span>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={`input h-10 input-bordered border-2 border-white bg-[#57595d] rounded-full w-full required`} />
                  </label>
                </div>
                <div className='flex flex-col lg:w-1/2'>
                  <label className='block'>
                  <span class="after:content-['*'] after:ml-0.5 after:text-red-700 block text-sm pl-4 py-1">Last Name</span>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="input h-10 input-bordered border-2 border-white bg-[#57595d] rounded-full w-full" />
                  </label>
                </div>
              </div>

              <div className='flex flex-col lg:flex-row gap-3 lg:gap-10'>
                <div className='flex flex-col lg:w-1/2'>
                  <label className='block'>
                  <span class="after:content-['*'] after:ml-0.5 after:text-red-700 block text-sm pl-4 py-1">Phone Number</span>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-300 pointer-events-none">+91</span>
                    <input 
                      type="text" name="phoneNumber" 
                      value={formData.phoneNumber.replace("+91 ", "")} 
                      onChange={handleChange} 
                      className="input h-10 input-bordered border-2 border-white bg-[#57595d] rounded-full w-full pl-11"
                    />
                  </div>
                  </label>
                </div>
                <div className='flex flex-col lg:w-1/2'>
                  <label className='block'>
                  <span class="after:content-['*'] after:ml-0.5 after:text-red-700 block text-sm pl-4 py-1">Email</span>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className=" input h-10 input-bordered border-2 border-white bg-[#57595d] rounded-full w-full"/>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className='w-full'>
            <div className='text-3xl font-semibold pb-2 text-[#FFFFFFD9]'>College Details</div>
            <div className='flex flex-col gap-3 text-[#FFFFFFE5]'>
              <div className='flex flex-col lg:flex-row gap-3 lg:gap-10'>
                <div className='flex flex-col lg:w-1/2'>
                  <label className='block'>
                  <span class="after:content-['*'] after:ml-0.5 after:text-red-700 block text-sm pl-4 py-1">College Name</span>
                  <input type="text" name="collegeName" value={formData.collegeName} onChange={handleChange} className="input h-10 input-bordered border-2 border-white bg-[#57595d] rounded-full w-full" />
                  </label>
                </div>
                <div className='flex flex-col lg:w-1/2'>
                  <label className='block'>
                  <span class="after:content-['*'] after:ml-0.5 after:text-red-700 block text-sm pl-4 py-1">Branch and Semester</span>
                  <input type="text" name="branchSem" value={formData.branchSem} onChange={handleChange} className="input h-10 input-bordered border-2 border-white bg-[#57595d] rounded-full w-full" />
                  </label>
                </div>
              </div>

              <div className='flex flex-col lg:flex-row gap-3 lg:gap-10'>
                <div className='flex flex-col lg:w-1/2 pl-4 pb-2'>
                  <label className=''>
                  <span class="after:content-['*'] after:ml-0.5 after:text-red-700 block text-base lg:text-lg  py-1">Are you an IEEE member?</span>
                  </label>
                  <div className='flex gap-16'>
                    <div className='flex gap-2'>
                      <input type="radio" name="isIeeeMember" value={true} onChange={handleChange} className="radio checked:bg-[#004278] checked:border-0 border-[3px] border-white" defaultChecked /><label>Yes</label>
                    </div>
                    <div className='flex gap-2'>
                      <input type="radio" name="isIeeeMember" value={false} onChange={handleChange} className="radio checked:bg-[#004278] checked:border-0 border-[3px] border-white" /><label>No</label>
                    </div>
                  </div>
                </div>

                <div className='flex flex-col lg:w-1/2'>
                  <label className={`${isMember? 'block': 'hidden'}`}>
                  <span class="after:content-['*'] after:ml-0.5 after:text-red-700 block text-sm pl-4 py-1">IEEE Membership ID</span>
                  <input type="text" name="ieeeId" value={formData.ieeeId} onChange={handleChange} className="input h-10 input-bordered border-2 border-white bg-[#57595d] rounded-full w-full" />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              className="btn btn-sm h-9 w-44 rounded-full text-white border border-[#505459]"
              style={{
                background: `linear-gradient(90deg, rgba(136, 158, 175, 0.8) 0%, rgba(27, 30, 32, 0.744) 98.32%)`,
              }}
              onClick={handleSubmit}
            >
              Continue
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Register;