import React from 'react'

const Register = () => {
  return (
    <div className='text-white flex flex-col gap-7 items-center relative'>
      <div>
        <div className='text-3xl font-semibold pb-2 text-[#FFFFFFD9]'>Student Details</div>
        <div className='flex flex-col gap-3 text-[#FFFFFFE5]'>
          <div className='flex gap-10'>
            <div className='flex flex-col'> 
              <label className='text-sm pl-4 py-1'>First Name</label>
              <input type="text" className="input h-10 input-bordered border-2 border-white bg-[#57595d] rounded-full w-72" />
            </div>
            <div className='flex flex-col'>
              <label className='text-sm  pl-4 py-1'>Last Name</label>
              <input type="text" className="input h-10 input-bordered border-2 border-white bg-[#57595d] rounded-full w-72" />
            </div>
          </div>

          <div className='flex gap-10'>
            <div className='flex flex-col'>
              <label className='text-sm pl-4 py-1'>Phone Number</label>
              <input type="text" className="input h-10 input-bordered border-2 border-white bg-[#57595d] rounded-full w-72" />
            </div>
            <div className='flex flex-col'>
              <label className='text-sm pl-4 py-1'>Email ID</label>
              <input type="text" className="input h-10 input-bordered border-2 border-white bg-[#57595d] rounded-full w-72" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className='text-3xl font-semibold pb-2 text-[#FFFFFFD9]'>College Details</div>
        <div className='flex flex-col gap-3'>
          <div className='flex gap-10 text-[#FFFFFFE5]'>
            <div className='flex flex-col'>
              <label className='text-sm pl-4 py-1'>College Name</label>
              <input type="text" className="input h-10 input-bordered border-2 border-white bg-[#57595d] rounded-full w-72" />
            </div>
            <div className='flex flex-col'>
              <label className='text-sm pl-4 py-1'>Branch and Semester</label>
              <input type="text" className="input h-10 input-bordered border-2 border-white bg-[#57595d] rounded-full w-72" />
            </div>
          </div>

          <div className='flex gap-10'>

            <div className='flex flex-col w-1/2 ml-4'>
              <label className='text-lg  py-1'>Are you an IEEE member?</label>
              <div className='flex gap-16'>
                <div className='flex gap-2 text-[#FFFFFFE5]'>
                  <input type="radio" name="radio-1" className="radio checked:bg-[#004278] checked:border-0 border-[3px] border-white" defaultChecked /><label>Yes</label>
                </div>
                <div className='flex gap-2'>
                  <input type="radio" name="radio-1" className="radio checked:[#004278] checked:border-0 border-[3px] border-white" /><label>No</label>
                </div> 
              </div>
            </div>

            <div className='flex flex-col absolute right-0'>
              <label className='text-sm pl-4 py-1 text-[#FFFFFFE5]'>IEEE Membership ID</label>
              <input type="text" className="input h-10 input-bordered border-2 border-white bg-[#57595d] rounded-full w-72" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <div
          className="btn btn-sm h-9 w-44 rounded-full text-white border border-[#505459]"
          style={{
            background: `linear-gradient(90deg, rgba(136, 158, 175, 0.8) 0%, rgba(27, 30, 32, 0.744) 98.32%)`,
          }}
        >
          SIGN UP
        </div>
      </div>



    </div>
  )
}

export default Register