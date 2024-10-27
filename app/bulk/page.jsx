"use client";
import React, { useState } from 'react';
import db from "../../utils/config"; // Ensure Firebase is initialized here
import { collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Image from "next/image";
import Qr from '../../public/qr.png';
const BulkReg = () => {
  const storage = getStorage(); // Initialize Firebase Storage
  const [totalAmount, setTotalAmount] = useState(5000);
  const [isSubmitted, setIsSubmitted] = useState(false); // Track submission status

  const [teamMembers, setTeamMembers] = useState([
    { firstName: '', lastName: '', branch: '', college: '', semester: '' },
    { firstName: '', lastName: '', branch: '', college: '', semester: '' },
    { firstName: '', lastName: '', branch: '', college: '', semester: '' },
    { firstName: '', lastName: '', branch: '', college: '', semester: '' },

  ]);
  const [membershipConfirmed, setMembershipConfirmed] = useState(false);
  const [teamLead, setTeamLead] = useState({
    name: '',
    email: '',
    phone: '',
    branch: '',
    college: '',
    semester: '',
    transactionId: '',
  });
  const [paymentScreenshot, setPaymentScreenshot] = useState(null); // To hold the screenshot file

  const handleInputChange = (event, index) => {
    const { name, value } = event.target;
    const updatedMembers = [...teamMembers];
    updatedMembers[index][name] = value;
    setTeamMembers(updatedMembers);
  };

  const handleTeamLeadChange = (event) => {
    const { name, value } = event.target;
    setTeamLead((prev) => ({ ...prev, [name]: value }));
  };

  const handleScreenshotChange = (event) => {
    setPaymentScreenshot(event.target.files[0]); // Store the uploaded file
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      let screenshotUrl = null;

      // Upload screenshot to Firebase Storage if available
      if (paymentScreenshot) {
        const screenshotRef = ref(storage, `upiscreenshots/${Date.now()}_${paymentScreenshot.name}`);
        await uploadBytes(screenshotRef, paymentScreenshot);
        screenshotUrl = await getDownloadURL(screenshotRef); // Retrieve the screenshot URL
      }

      // Prepare data to save in Firestore
      const teamData = {
        teamLead: teamLead,
        teamMembers: teamMembers,
        totalAmount: totalAmount,
        
        transactionId: teamLead.transactionId,
        screenshotUrl: screenshotUrl, // URL for the payment screenshot
      };

      // Save all data as a single document in the 'bulkReg' collection
      await addDoc(collection(db, 'bulkReg'), teamData);
      window.location.href = "https://docs.google.com/forms/d/e/1FAIpQLSfnkMd9l7DcuRVlReTkyNz7hkO2nzamp2AULEa7cvHIlF4NLA/viewform";

      setIsSubmitted(true); 
    
      // Optionally reset the form or handle post-submit actions
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Error submitting data. Please try again.');
    }
  };
  
  return (
    <div className="flex items-center justify-centermin-h-screen bg-neutral-900 text-white">
      {isSubmitted ? (
        <div className="p-8 rounded-md shadow-md  w-screen h-screen text-center">
          <h2 className="text-2xl font-bold mb-4">Registration Successful!</h2>
          <p className="text-lg">One more Step to complete the process.</p>
          <p className="mt-4 text-6sm">
            Please also complete <a href="https://docs.google.com/forms/d/e/1FAIpQLSfnkMd9l7DcuRVlReTkyNz7hkO2nzamp2AULEa7cvHIlF4NLA/viewform" className="underline text-white">this additional Google Form</a>.
          </p>
        </div>
      ) : (
    <div className="bg-neutral-900 quicksand-600 flex items-center text-black justify-center min-h-screen w-screen">
      <div className="bg-white/10 backdrop-blur text-white p-8 rounded shadow-md w-full md:w-1/2 my-32">
        <h2 className="text-2xl font-bold mb-6 text-center">Bulk Registration</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white/50 font-semibold mb-2">Team Lead Name:</label>
            <input
              type="text"
              name="name"
              value={teamLead.name}
              onChange={handleTeamLeadChange}
              className="block w-full px-3 py-2 border border-gray-300 bg-white/50  rounded-md text-black"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white/50 font-semibold mb-2">Email ID:</label>
            <input
              type="email"
              name="email"
              value={teamLead.email}
              onChange={handleTeamLeadChange}
              className="block w-full px-3 py-2 border border-gray-300 bg-white/50  rounded-md text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white/50 font-semibold mb-2">Phone Number:</label>
            <input
              type="tel"
              name="phone"
              value={teamLead.phone}
              onChange={handleTeamLeadChange}
              className="block w-full px-3 py-2 border border-gray-300 bg-white/50  rounded-md text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white/50 font-semibold mb-2">Branch:</label>
            <input
              type="text"
              name="branch"
              value={teamLead.branch}
              onChange={handleTeamLeadChange}
              className="block w-full px-3 py-2 border border-gray-300 bg-white/50  rounded-md text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white/50 font-semibold mb-2">College:</label>
            <input
              type="text"
              name="college"
              value={teamLead.college}
              onChange={handleTeamLeadChange}
              className="block w-full px-3 py-2 border border-gray-300 bg-white/50  rounded-md text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white/50 font-semibold mb-2">Semester:</label>
            <input
              type="text"
              name="semester"
              value={teamLead.semester}
              onChange={handleTeamLeadChange}
              className="block w-full px-3 py-2 border border-gray-300 bg-white/50  rounded-md text-black"
              required
            />
          </div>
         

          {/* Team Member Input Fields */}
          {teamMembers.map((member, index) => (
            <div key={index} className="mt-4">
              <h3 className="text-lg font-semibold mb-2 underline underline-offset-4 text-center">Team Member {index + 1}</h3>
              <div className="mb-2">
                <label className="block text-white/50">First Name:</label>
                <input
                  type="text"
                  name="firstName"
                  value={member.firstName}
                  onChange={(e) => handleInputChange(e, index)}
                  className="block w-full px-3 py-2 border border-gray-300 bg-white/50  rounded-md text-black"
                  required
                />
              </div>
              <div className="mb-2">
                <label className="block text-white/50">Last Name:</label>
                <input
                  type="text"
                  name="lastName"
                  value={member.lastName}
                  onChange={(e) => handleInputChange(e, index)}
                  className="block w-full px-3 py-2 border border-gray-300 bg-white/50  rounded-md text-black"
                  required
                />
              </div>
              <div className="mb-2">
                <label className="block text-white/50">Branch:</label>
                <input
                  type="text"
                  name="branch"
                  value={member.branch}
                  onChange={(e) => handleInputChange(e, index)}
                  className="block w-full px-3 py-2 border border-gray-300 bg-white/50  rounded-md text-black"
                  required
                />
              </div>
              <div className="mb-2">
                <label className="block text-white/50">College:</label>
                <input
                  type="text"
                  name="college"
                  value={member.college}
                  onChange={(e) => handleInputChange(e, index)}
                  className="block w-full px-3 py-2 border border-gray-300 bg-white/50  rounded-md text-black"
                  required
                />
              </div>
              <div className="mb-2">
                <label className="block text-white/50">Semester:</label>
                <input
                  type="text"
                  name="semester"
                  value={member.semester}
                  onChange={(e) => handleInputChange(e, index)}
                  className="block w-full px-3 py-2 border border-gray-300 bg-white/50  rounded-md text-black"
                  required
                />
              </div>
            </div>
          ))}
          <div className='flex flex-col items-center gap-4 w-full'>
          <h1 className='text-2xl underline underline-offset-4'>Payment</h1>
          <Image src={Qr} alt="QR" width={180} height={180} className='flex items-center justify-center' />
    <span className="text-white text-sm">Scan the QR code to make payment</span>
    <span>OR</span>
    <span>UPI ID : Q966258565@ybl</span>
          <div className="mt-4 text-lg text-center font-extrabold text-red-800">
            Total Amount to Pay: ₹{totalAmount}
          </div>
          <div className="mb-4">
            <label className="block text-white/50 font-semibold mb-2">Transaction ID:</label>
            <input
              type="text"
              name="transactionId"
              value={teamLead.transactionId}
              onChange={handleTeamLeadChange}
              className="block w-full px-3 py-2 border border-gray-300 bg-white/50  rounded-md text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white/50 font-semibold mb-2">Payment Screenshot:</label>
            <input
              type="file"
              name="paymentScreenshot"
              accept="image/*"
              onChange={handleScreenshotChange}
              className="block w-full px-3 py-2 border border-gray-300 bg-white/50  rounded-md font-bold text-black/75"
              required
            />
          </div>  
          </div>
          
          <div className='w-full flex flex-col  justify-center items-center'>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded mt-4"
          >
            Submit
          </button>
           <span className='m-4'> For any queries contact us at +91 98954 31875</span>
          </div>
        </form>
      </div>
    </div>
  )}
  </div>
  );
};

export default BulkReg;
