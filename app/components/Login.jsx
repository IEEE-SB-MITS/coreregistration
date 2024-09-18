import React from 'react'

const Login = ({loginfailed}) => {
  return (
    <div className='flex flex-col gap-7 items-center text-white w-3/4'>
      <div className='flex flex-col gap-5 text-[#FFFFFFE5] w-full lg:w-1/2 items-center'>
        <div className='flex flex-col w-full'>
          <label className='text-sm pl-4 py-1'>Ticket Number</label>
          <input type="text" className="input h-10 input-bordered border-2 border-white bg-[#57595d] rounded-full w-full" />
        </div>
      
      </div>

      <div>
        <div
          className="btn btn-sm h-9 w-44 rounded-full text-xs text-white border border-[#505459]"
          style={{
            background: `linear-gradient(90deg, rgba(136, 158, 175, 0.8) 0%, rgba(27, 30, 32, 0.744) 98.32%)`,
          }}
        >
          DOWNLOAD TICKET
        </div>
      </div>

      <div className='hidden md:flex flex-col items-center absolute bottom-10 text-[#FFFFFFE5]'>
        <div>"Every great innovation has an origin. </div>
        <div>Can you find yours?" </div>
      </div>

    </div>
  )
}

export default Login