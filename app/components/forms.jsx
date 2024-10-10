'use client'
import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import SwitchSelector from "react-switch-selector";
import Image from "next/image";

const Forms = () => {
  const [isLogin, setIsLogin] = useState(false);

  const options = [
    {
      label: "REGISTER",
      value: "register",
      selectedBackgroundColor: `linear-gradient(90deg, rgba(136, 158, 175, 0.8) 0%, rgba(27, 30, 32, 0.744) 98.32%)`,
      selectedFontColor: "#fff",
    },
    {
      label: "LOGIN",
      value: "login",
      selectedBackgroundColor: `linear-gradient(90deg, rgba(136, 158, 175, 0.8) 0%, rgba(27, 30, 32, 0.744) 98.32%)`,
      selectedFontColor: "#fff",
    }
  ];

  const onChange = () => {
    setIsLogin(!isLogin);
  };

  const initialSelectedIndex = options.findIndex(({ value }) => value === "register");

  const loginfailed = () => {
    setIsLogin(false);
  };

  return (
    <div className='w-full min-h-screen lg:bg-white/10 rounded-lg text-white flex flex-col justify-between items-center font-normal pt-[70px] relative quicksand-600'>
      {/* Logo */}
      <div className='w-full absolute top-6 right-0 flex justify-end pb-10 pr-5'>
        <Image src="/logo.png" width={80} height={80} />
      </div>

      {/* SwitchSelector */}
      <div className='w-2/3 md:w-72 h-10 mb-8'>
        <SwitchSelector
          onChange={onChange}
          options={options}
          initialSelectedIndex={initialSelectedIndex}
          backgroundColor={"#fff"}
          fontColor={"#000"}
        />
      </div>

      {/* Form container */}
      <div className="flex flex-col justify-center flex-grow items-center w-full">
        <div className="w-full md:w-4/5 overflow-hidden h-full flex  justify-center">
          {isLogin ? <Login loginfailed /> : <Register />}
        </div>
      </div>

      {/* Mobile copyright image */}
      <div className='md:hidden m-6'>
        <Image src="/mobile-cr.png" width={211} height={95} alt='copyright' />
      </div>
    </div>
  );
};

export default Forms;
