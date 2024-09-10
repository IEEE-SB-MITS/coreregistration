import React from 'react'

const Login = () => {
  return (
    <div className='flex flex-col gap-7 items-center text-white'>
      <div className='flex flex-col gap-5'>
        <div className='flex flex-col'>
          <label className='text-sm font-medium pl-4 py-1'>Username</label>
          <input type="text" className="input h-10 input-bordered rounded-full w-72" />
        </div>
        <div className='flex flex-col'>
          <label className='text-sm font-medium pl-4 py-1'>Password</label>
          <input type="text" className="input h-10 input-bordered rounded-full w-72" />
        </div>
      </div>

      <div>
        <div className='btn btn-sm h-9 w-44 rounded-full'>LOGIN</div>
      </div>
    </div>
  )
}

export default Login