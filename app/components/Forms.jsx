'use client'
import React, { useState } from 'react'; 
import Login from './Login';
import Register from './Register';
import SwitchSelector from "react-switch-selector";
import Image from "next/image";
import logo from '../../public/logo.png'

const Forms = () => {
  const [isLogin, setIsLogin] = useState(false)

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
    setIsLogin(!isLogin)
  };

  const initialSelectedIndex = options.findIndex(({value}) => value === "register");

  return (
    <div className='w-full md:w-1/2 bg-black flex flex-col justify-center items-center font-normal pt-20 lg:pt-0'>
      <div className='absolute top-5 right-5'><Image src={logo} width={80} height={80}/></div>
    <div className='w-2/3 md:w-72 h-10 md:h-12 mb-8'>
        <SwitchSelector
            onChange={onChange}
            options={options}
            initialSelectedIndex={initialSelectedIndex}
            backgroundColor={"#fff"}
            fontColor={"#000"}
        />
    </div>

      {isLogin? <Login/> : <Register />}
    </div>
  )
}

export default Forms
