"use client";
import React, { useState } from 'react';
import db from "../../utils/config"; // Make sure to import your initialized Firestore
import { collection, addDoc } from 'firebase/firestore';

const BulkReg = () => {
  const [totalAmount, setTotalAmount] = useState(5000); // Default total amount
  const [teamMembers, setTeamMembers] = useState([
    { firstName: '', lastName: '', branch: '', college: '', semester: '' },
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
    semester: ''
  });

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Add team lead info
      await addDoc(collection(db, 'bulkReg'), { teamLead });

      // Add each team member's info
      for (const member of teamMembers) {
        await addDoc(collection(db, 'bulkReg'), member);
      }

      alert('Data submitted successfully!');
      // Reset the form or handle post-submit actions as needed
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Error submitting data. Please try again.');
    }
  };

  return (
    <div className="bg-neutral-900 quicksand-600 flex items-center justify-center min-h-screen min-w-screen">
      <div className="bg-white/10 backdrop-blur text-white p-8 rounded shadow-md w-1/2 my-32">
        <h2 className="text-2xl font-bold mb-6 text-center">Bulk Registration</h2>

        {/* Team Lead Info */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white/50 font-semibold mb-2">Team Lead Name:</label>
            <input
              type="text"
              name="name"
              value={teamLead.name}
              onChange={handleTeamLeadChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white/50 font-semibold mb-2">Email ID:</label>
            <input
              type="email"
              name="email"
              value={teamLead.email}
              onChange={handleTeamLeadChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md"
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
              className="block w-full px-3 py-2 border border-gray-300 rounded-md"
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
              className="block w-full px-3 py-2 border border-gray-300 rounded-md"
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
              className="block w-full px-3 py-2 border border-gray-300 rounded-md"
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
              className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Team Member Inputs */}
          {teamMembers.map((member, index) => (
            <div key={index} className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Team Member {index + 1}</h3>
              <div className="mb-2">
                <label className="block text-white/50">First Name:</label>
                <input
                  type="text"
                  name="firstName"
                  value={member.firstName}
                  onChange={(e) => handleInputChange(e, index)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
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
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
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
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
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
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
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
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>
          ))}

          {/* Total Amount Display */}
            <div className="mt-4 text-lg text-center font-semibold text-gray-800">
              Total Amount to Pay: ₹{totalAmount}
            </div>

          {/* Submit Button */}
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded mt-4"
            >
              Submit
            </button>
        </form>
      </div>
    </div>
  );
};

export default BulkReg;
