'use client'
import React, { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import db from '../utils/firebase.config.js';
import Image from "next/image";
import { getStorage, ref, uploadBytes } from 'firebase/storage';

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
    transactionId: '',
  });

  const [showDetails, setShowDetails] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isMember, setIsMember]  = useState(true);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');


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

  const renameFile = (file, newName) => {
    const renamedFile = new File([file], `${newName}${file.name.substring(file.name.lastIndexOf('.'))}`, { type: file.type });
    console.log('Renamed file:', renamedFile);
    const storage = getStorage();
    const storageRef = ref(storage, `upiscreenshots/${renamedFile.name}`);

    uploadBytes(storageRef, renamedFile).then((snapshot) => {
      console.log('Uploaded a blob or file!', snapshot);
    }).catch((error) => {
      console.error('Error uploading file:', error);
    });
  };

  async function addData(firstName, lastName, phoneNumber, email, collegeName, branchSem, ieeeId, transactionId) {
    try {
      const docRef = await addDoc(collection(db, "CORE"), {
        firstName,
        lastName,
        phoneNumber,
        email,
        collegeName,
        branchSem,
        ieeeId,
        transactionId,
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
  const { firstName, lastName, phoneNumber, email, collegeName, branchSem, ieeeId } = formData;

  if (!firstName || !lastName || !phoneNumber || !email || !collegeName || !branchSem || (isMember && !ieeeId)) {
    setError('Please fill in all the required fields.');
    return;
  }

  const phoneRegex = /^\d{10}$/;
  const pn = phoneNumber.replace("+91 ", "");
  if (!phoneRegex.test(pn)) {
    setError('Enter a valid 10-digit phone number.');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setError('Enter a valid email address.');
    return;
  }

  setError('');
  setIsSubmitted(true);
};


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit1 = async (e) => {
    e.preventDefault();
    const { firstName, lastName, phoneNumber, email, collegeName, branchSem, ieeeId, transactionId } = formData;
    const success = await addData(firstName, lastName, phoneNumber, email, collegeName, branchSem, ieeeId, transactionId);
    if (success) {
      if (file) {
        renameFile(file, transactionId);
      }
      setIsSubmitted(true);
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
      {error && (
        <div class="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-black dark:text-red-400" role="alert">
        <svg class="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
        </svg>
        <span class="sr-only">Info</span>
        <div>
          <span class="font-medium">Alert!</span> {error}
        </div>
      </div>
      )}
      {showDetails ? (
        <div className='w-full flex flex-col items-center'>
          <div className='text-3xl font-semibold pb-2 text-[#FFFFFFD9]'>Scan the QR code</div>
          <div className='flex flex-col justify-center gap-3 text-[#FFFFFFE5]'>
            <div className='flex flex-col justify-center items-center'>
              <Image src="" width="80" height="90" alt="QR Code" />
            </div>
            <div className='flex flex-col justify-center'>
              <label className='text-sm pl-4 py-1'>Transaction Id</label>
              <input 
                type="text" 
                name="transactionId" 
                value={formData.transactionId} 
                onChange={handleChange} 
                className="input h-10 input-bordered border-2 border-white bg-[#57595d] rounded-full w-full" 
              />
            </div>
            <div className='flex flex-col justify-center items-center'>
              <label className='text-sm pl-4 py-1'>Upload File</label>
              <input 
                type="file" 
                onChange={handleFileChange} 
                className="input h-10 input-bordered border-2 border-white bg-[#57595d] rounded-full w-full" 
              />
            </div>
            <div className='flex flex-col justify-center items-center'>
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
                    <span className="after:content-['*'] after:ml-0.5 after:text-red-700 block text-sm pl-4 py-1">First Name</span>
                    <input 
                      type="text" 
                      name="firstName" 
                      value={formData.firstName} 
                      onChange={handleChange} 
                      className="input h-10 input-bordered border-2 border-white bg-[#57595d] rounded-full w-full" 
                    />
                  </label>
                </div>
                <div className='flex flex-col lg:w-1/2'>
                  <label className='block'>
                    <span className="after:content-['*'] after:ml-0.5 after:text-red-700 block text-sm pl-4 py-1">Last Name</span>
                    <input 
                      type="text" 
                      name="lastName" 
                      value={formData.lastName} 
                      onChange={handleChange} 
                      className="input h-10 input-bordered border-2 border-white bg-[#57595d] rounded-full w-full" 
                    />
                  </label>
                </div>
              </div>
              <div className='flex flex-col lg:flex-row gap-3 lg:gap-10'>
                <div className='flex flex-col lg:w-1/2'>
                  <label className='block'>
                    <span className="after:content-['*'] after:ml-0.5 after:text-red-700 block text-sm pl-4 py-1">Phone Number</span>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-300 pointer-events-none">+91</span>
                      <input 
                        type="text" 
                        name="phoneNumber" 
                        value={formData.phoneNumber.replace("+91 ", "")} 
                        onChange={handleChange} 
                        className="input h-10 input-bordered border-2 border-white bg-[#57595d] rounded-full w-full pl-11" 
                      />
                    </div>
                  </label>
                </div>
                <div className='flex flex-col lg:w-1/2'>
                  <label className='block'>
                    <span className="after:content-['*'] after:ml-0.5 after:text-red-700 block text-sm pl-4 py-1">Email</span>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      className="input h-10 input-bordered border-2 border-white bg-[#57595d] rounded-full w-full" 
                    />
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
                    <span className="after:content-['*'] after:ml-0.5 after:text-red-700 block text-sm pl-4 py-1">College Name</span>
                    <input 
                      type="text" 
                      name="collegeName" 
                      value={formData.collegeName} 
                      onChange={handleChange} 
                      className="input h-10 input-bordered border-2 border-white bg-[#57595d] rounded-full w-full" 
                    />
                  </label>
                </div>
                <div className='flex flex-col lg:w-1/2'>
                  <label className='block'>
                    <span className="after:content-['*'] after:ml-0.5 after:text-red-700 block text-sm pl-4 py-1">Branch and Semester</span>
                    <input 
                      type="text" 
                      name="branchSem" 
                      value={formData.branchSem} 
                      onChange={handleChange} 
                      className="input h-10 input-bordered border-2 border-white bg-[#57595d] rounded-full w-full" 
                    />
                  </label>
                </div>
              </div>
              <div className='flex flex-col lg:flex-row gap-3 lg:gap-10'>
                <div className='flex flex-col lg:w-1/2 pl-4 pb-2'>
                  <label>
                    <span className="after:content-['*'] after:ml-0.5 after:text-red-700 block text-base lg:text-lg py-1">Are you an IEEE member?</span>
                  </label>
                  <div className='flex gap-16'>
                    <div className='flex gap-2'>
                      <input 
                        type="radio" 
                        name="isIeeeMember" 
                        value={true} 
                        onChange={handleChange} 
                        className="radio checked:bg-[#004278] checked:border-0 border-[3px] border-white" 
                        defaultChecked 
                      />
                      <label>Yes</label>
                    </div>
                    <div className='flex gap-2'>
                      <input 
                        type="radio" 
                        name="isIeeeMember" 
                        value={false} 
                        onChange={handleChange} 
                        className="radio checked:bg-[#004278] checked:border-0 border-[3px] border-white" 
                      />
                      <label>No</label>
                    </div>
                  </div>
                </div>
                <div className='flex flex-col lg:w-1/2'>
                  <label className={`${isMember ? 'block' : 'hidden'}`}>
                    <span className="after:content-['*'] after:ml-0.5 after:text-red-700 block text-sm pl-4 py-1">IEEE Membership ID</span>
                    <input 
                      type="text" 
                      name="ieeeId" 
                      value={formData.ieeeId} 
                      onChange={handleChange} 
                      className="input h-10 input-bordered border-2 border-white bg-[#57595d] rounded-full w-full" 
                    />
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
}

export default Register;