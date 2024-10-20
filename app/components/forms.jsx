
'use client';
import React, { useState, useEffect } from 'react';
import Login from './Login';
import Register from './Register';
import BootCamp from './Bootcamp';
import SwitchSelector from 'react-switch-selector';
import Image from 'next/image';
import Loader from './elements/loader';
const Forms = () => {
  const [selectedOption, setSelectedOption] = useState(0); // 0 for Register, 1 for BootCamp, 2 for Login
  const [isLoading, setIsLoading] = useState(false); // New state to track loading

  const options = [
    {
      label: 'Conclave',
      value: 0,
      selectedBackgroundColor: `linear-gradient(90deg, rgba(136, 158, 175, 0.8) 0%, rgba(27, 30, 32, 0.744) 98.32%)`,
      selectedFontColor: '#fff',
    },
    {
      label: 'BootCamp',
      value: 1,
      selectedBackgroundColor: `linear-gradient(90deg, rgba(136, 158, 175, 0.8) 0%, rgba(27, 30, 32, 0.744) 98.32%)`,
      selectedFontColor: '#fff',
    },
    {
      label: 'Login',
      value: 2,
      selectedBackgroundColor: `linear-gradient(90deg, rgba(136, 158, 175, 0.8) 0%, rgba(27, 30, 32, 0.744) 98.32%)`,
      selectedFontColor: '#fff',
    },
  ];

  const onChange = (newValue) => {
    setIsLoading(true); // Set loading state to true on change
    setTimeout(() => {
      setSelectedOption(newValue); // Switch to the selected form after loading
      setIsLoading(false); // Turn off the loading state
    }, 1000); // Delay for 1 second to simulate loading
  };

  const initialSelectedIndex = options.findIndex(({ value }) => value === 0);

  return (
    <div className='w-full min-h-screen lg:bg-white/10 rounded-lg text-white flex flex-col justify-between items-center font-normal pt-[70px] relative quicksand-600'>
      {/* Logo */}
      <div className='w-full absolute top-6 right-0 flex justify-end pb-10 pr-5'>
        <Image src='/logo.png' width={80} height={80} />
      </div>

      {/* SwitchSelector */}
      <div className='w-2/3 md:w-72 h-10 mb-8'>
        <SwitchSelector
          onChange={onChange}
          options={options}
          initialSelectedIndex={initialSelectedIndex}
          backgroundColor={'#fff'}
          fontColor={'#000'}
        />
      </div>

      {/* Form container */}
      <div className='flex flex-col justify-center flex-grow items-center w-full'>
        <div className='w-full md:w-4/5 overflow-hidden h-full flex justify-center'>
          {isLoading ? ( // Show loading message when the form is being switched
            <div className= "text-white "><Loader/></div>
          ) : (
            <>
              {selectedOption === 0 && <Register />}
              {selectedOption === 1 && <BootCamp />}
              {selectedOption === 2 && <Login />}
            </>
          )}
        </div>
      </div>

      {/* Mobile copyright image */}
      <div className='md:hidden m-6'>
        <Image src='/mobile-cr.png' width={211} height={95} alt='copyright' />
      </div>
    </div>
  );
};

export default Forms;


