'use client'
import React, { useState } from 'react'; 
import Login from './Login';
import Register from './Register';
import SwitchSelector from "react-switch-selector";

const Forms = () => {
  const [isLogin, setIsLogin] = useState(false)

  const options = [
    {
        label: "Register",
        value: "register",
        selectedBackgroundColor: "black",
        selectedFontColor: "#fff",
    },
    {
        label: "Login",
        value: "login",
        selectedBackgroundColor: "black",
        selectedFontColor: "#fff",
    }
  ];

  const onChange = () => {
    setIsLogin(!isLogin)
  };

  const initialSelectedIndex = options.findIndex(({value}) => value === "register");

  return (
    <div className='w-1/2 bg-black flex flex-col justify-center items-center'>
    <div className='w-72 h-12 mb-8'>
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

