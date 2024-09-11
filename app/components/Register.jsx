'use client'
import React, { useState } from 'react'; 

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
  });

  const handleChange = (e) =>{
    const {name, value, type, checked} = e.target;
    const fieldValue = value;
    setFormData( (prevData) => ({
      ...prevData, [name]: fieldValue
    }))
  }

  const handleSubmit =(e) =>{
    e.preventDefault();
    console.log(formData);
  }

  return (
    <div className='text-white flex flex-col gap-7 items-center relative w-3/4'>
      <div className='w-full'>
        <div className='text-3xl font-semibold pb-2 text-[#FFFFFFD9]'>Student Details</div>
        <div className='flex flex-col gap-3 text-[#FFFFFFE5]'>
          <div className='flex flex-col lg:flex-row gap-3 lg:gap-10'>
            <div className='flex flex-col lg:w-1/2'> 
              <label className='text-sm pl-4 py-1'>First Name</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="input h-10 input-bordered border-2 border-white bg-[#57595d] rounded-full w-full" />
            </div>
            <div className='flex flex-col lg:w-1/2'>
              <label className='text-sm  pl-4 py-1'>Last Name</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="input h-10 input-bordered border-2 border-white bg-[#57595d] rounded-full w-full" />
            </div>
          </div>

          <div className='flex flex-col lg:flex-row gap-3 lg:gap-10'>
            <div className='flex flex-col lg:w-1/2'>
              <label className='text-sm pl-4 py-1'>Phone Number</label>
              <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="input h-10 input-bordered border-2 border-white bg-[#57595d] rounded-full w-full" />
            </div>
            <div className='flex flex-col lg:w-1/2'>
              <label className='text-sm pl-4 py-1'>Email ID</label>
              <input type="text" name="email" value={formData.email} onChange={handleChange} className="input h-10 input-bordered border-2 border-white bg-[#57595d] rounded-full w-full" />
            </div>
          </div>
        </div>
      </div>

      <div className='w-full'>
        <div className='text-3xl font-semibold pb-2 text-[#FFFFFFD9]'>College Details</div>
        <div className='flex flex-col gap-3'>
          <div className='flex flex-col lg:flex-row gap-3 lg:gap-10 text-[#FFFFFFE5]'>
            <div className='flex flex-col lg:w-1/2'>
              <label className='text-sm pl-4 py-1'>College Name</label>
              <input type="text" name="collegeName" value={formData.collegeName} onChange={handleChange} className="input h-10 input-bordered border-2 border-white bg-[#57595d] rounded-full w-full" />
            </div>
            <div className='flex flex-col lg:w-1/2'>
              <label className='text-sm pl-4 py-1'>Branch and Semester</label>
              <input type="text" name="branchSem" value={formData.branchSem} onChange={handleChange} className="input h-10 input-bordered border-2 border-white bg-[#57595d] rounded-full w-full" />
            </div>
          </div>

          <div className='flex flex-col lg:flex-row gap-3 lg:gap-10'>

            <div className='flex flex-col lg:w-1/2 pl-4'>
              <label className='text-base lg:text-lg  py-1'>Are you an IEEE member?</label>
              <div className='flex gap-16'>
                <div className='flex gap-2 text-[#FFFFFFE5]'>
                  <input type="radio" name="isIEEEMember" value={true}  onChange={handleChange} className="radio checked:bg-[#004278] checked:border-0 border-[3px] border-white" defaultChecked /><label>Yes</label>
                </div>
                <div className='flex gap-2'>
                  <input type="radio" name="isIEEEMember" value={false}  onChange={handleChange} className="radio checked:bg-[#004278] checked:border-0 border-[3px] border-white" /><label>No</label>
                </div> 
              </div>
            </div>

            <div className='flex flex-col lg:w-1/2'>
              <label className='text-sm pl-4 py-1 text-[#FFFFFFE5]'>IEEE Membership ID</label>
              <input type="text" name="ieeeId" value={formData.ieeeId} onChange={handleChange} className="input h-10 input-bordered border-2 border-white bg-[#57595d] rounded-full w-full" />
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
          onClick={handleSubmit}
        >
          SIGN UP
        </div>
      </div>

    </div>
  )
}

export default Register