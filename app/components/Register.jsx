"use client";
import React, { useState, useEffect } from "react";
import { collection, addDoc, query, where, getDoc, getDocs, doc, updateDoc } from "firebase/firestore";
import db from "../utils/firebase.config.js";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import qr from '../../public/qr.jpg';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    collegeName: "",
    branchSem: "",
    isIeeeMember: true,
    isRasMember: true,
    ieeeId: "",
    transactionId: "",
    status: "pending",
    coupon: "",
  });

  const [showDetails, setShowDetails] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isMember, setIsMember] = useState(true);
  const [isRasMember, setIsRasMember] = useState(true);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ticketNumber, setTicketNumber] = useState(0);
  const [timer, setTimer] = useState(0);

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "phoneNumber" ? "+91 " + value.replace("+91 ", "") : fieldValue,
    }));

    if (name === "isIeeeMember") setIsMember(value === "true");
    if (name === "isRasMember") setIsRasMember(value === "true");
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const renameFile = (file, newName) => {
    const renamedFile = new File(
      [file],
      `${newName}${file.name.substring(file.name.lastIndexOf("."))}`,
      { type: file.type }
    );
    const storage = getStorage();
    const storageRef = ref(storage, `upiscreenshots/${renamedFile.name}`);

    uploadBytes(storageRef, renamedFile)
      .then((snapshot) => console.log("Uploaded a blob or file!", snapshot))
      .catch((error) => console.error("Error uploading file:", error));
  };

  async function checkDuplicateEmail(email) {
    const q = query(collection(db, "CORE"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  }

  async function addData(formData) {
    try {
      const ticketDocRef = doc(db, "tickets", "currentTicket");
      const ticketDoc = await getDoc(ticketDocRef);
      if (!ticketDoc.exists()) {
        throw new Error("Ticket document does not exist!");
      }
      const currentTicket = ticketDoc.data().ticketNumber;
      const nextTicket = currentTicket + 1;
      setTicketNumber(currentTicket);
      await updateDoc(ticketDocRef, { ticketNumber: nextTicket });

      const docRef = await addDoc(collection(db, "CORE"), {
        ...formData,
        status: "pending",
        ticketNumber: currentTicket,
      });

      console.log("Document written with ID: ", docRef.id);
      window.location.href = `/ticket?ticketNumber=${currentTicket}`;
      return true;
    } catch (error) {
      console.error("Error adding document: ", error);
      return false;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, phoneNumber, email, collegeName, branchSem, ieeeId } = formData;

    // Validation
    if (!firstName || !lastName || !phoneNumber || !email || !collegeName || !branchSem || (isMember && !ieeeId && isRasMember)) {
      setError("Please fill in all the required fields.");
      return;
    }

    const phoneRegex = /^\d{10}$/;
    const pn = phoneNumber.replace("+91 ", "");
    if (!phoneRegex.test(pn)) {
      setError("Enter a valid 10-digit phone number.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Enter a valid email address.");
      return;
    }

    setError("");
    setShowDetails(true);
  };

  const handleSubmit1 = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.transactionId) {
      setError("Transaction ID is required.");
      setLoading(false);
      return;
    }

    if (!file) {
      setError("Please upload the transaction screenshot.");
      setLoading(false);
      return;
    }

    const emailExists = await checkDuplicateEmail(formData.email);
    if (emailExists) {
      setError("Email already registered.");
      setLoading(false);
      return;
    }

    const success = await addData(formData);

    if (success) {
      if (file) {
        renameFile(file, formData.transactionId);
      }
      setIsSubmitted(true);
    } else {
      setError("Error adding data");
    }
    setLoading(false);
  };

  useEffect(() => {
    let timerId;
    if (error) {
      setTimer(5);
      timerId = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timerId);
  }, [error]);

  useEffect(() => {
    if (timer === 0) {
      setError(null);
    }
  }, [timer]);

  const renderError = () => (
    <div className="fixed top-16  right-5 p-2 w-80 md:w-1/4 z-50 ">
      <div className="relative bg-gradient-to-r from-[#4a1000] to-red-600 text-white p-3 rounded-lg shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <svg className="w-6 h-6 text-orange-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
          </div>
          <div className="flex-grow">
            <span className="font-semibold">Alert!</span> <p className="text-xs">{error}</p>
          </div>
        </div>
        <div className="mt-2 h-1 bg-gray-200 rounded-full">
          <div
            className="h-full bg-red-500 transition-all duration-1000 ease-linear"
            style={{ width: `${(timer / 5) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );

  const renderFormField = (label, name, type = "text", required = true) => (
    <div className="flex flex-col w-full sm:w-1/2">
      <label className="block">
        <span className={`block text-sm pl-4 py-1 ${required ? "after:content-['*'] after:ml-0.5 after:text-red-700" : ""}`}>
          {label}
        </span>
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className="input h-10 input-bordered border-2 px-4 border-white bg-[#57595d] rounded-full w-full"
          required={required}
        />
      </label>
    </div>
  );

  const renderRadioButtons = (label, name, options) => (
    <div className="flex flex-col w-full sm:w-1/2 pl-4 pb-2">
      <label className="">
        <span className="after:content-['*'] after:ml-0.5 after:text-red-700 block text-base lg:text-lg py-1">
          {label}
        </span>
      </label>
      <div className="flex gap-16">
        {options.map((option) => (
          <div key={option.value} className="flex gap-2">
            <input
              type="radio"
              name={name}
              value={option.value}
              onChange={handleChange}
              className="radio checked:bg-[#004278] checked:border-0 border-[3px] border-white"
              defaultChecked={option.defaultChecked}
            />
            <label>{option.label}</label>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="text-white h-screen flex flex-col gap-7 items-center w-full max-w-screen-xl mx-auto px-4 md:px-8 overflow-auto">
      {error && renderError()}
      
      {showDetails ? (
        <div className="w-full max-w-md flex flex-col items-center">
          <div className="text-3xl font-semibold pb-2 text-[#FFFFFFD9]">
            Scan the QR code
          </div>
          <div className="flex flex-col justify-center gap-3 text-[#FFFFFFE5] w-full">
            <div className="flex flex-col justify-center items-center">
              {/* <Image src={qr} width="180" height="190" alt="QR Code" /> */}
              <Image src={qr} width="180" height="190" />   
              {/* Placeholder for QR code image */}
              
            </div>
            {renderFormField("Transaction Id", "transactionId")}
            <div className="flex flex-col justify-center items-center w-full">
              <label className="text-sm pl-4 py-1 text-left w-full">Upload File</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="input py-2 input-bordered border-2 px-4 border-white bg-[#57595d] rounded-full w-full"
              />
            </div>
            <div className="flex flex-col justify-center items-center w-full">
              <button
                className="btn btn-sm px-16 py-2 flex rounded-full text-white border border-[#505459] bg-gradient-to-r from-[rgba(136,158,175,0.8)] to-[rgba(27,30,32,0.744)]"
                onClick={handleSubmit1}
                disabled={loading}
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full max-w-4xl">
          <div className="mb-8">
            <div className="text-3xl font-semibold text-[#FFFFFFD9] mb-4">
              Student Details
            </div>
            <div className="flex flex-wrap gap-y-4">
              <div className="flex flex-col sm:flex-row w-full gap-4">
                {renderFormField("First Name", "firstName")}
                {renderFormField("Last Name", "lastName")}
              </div>
              <div className="flex flex-col sm:flex-row w-full gap-4">
                {renderFormField("Phone Number", "phoneNumber", "tel")}
                {renderFormField("Email", "email", "email")}
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="text-3xl font-semibold text-[#FFFFFFD9] mb-4">
              College Details
            </div>
            <div className="flex flex-wrap gap-y-4">
              <div className="flex flex-col sm:flex-row w-full gap-4">
                {renderFormField("College Name", "collegeName")}
                {renderFormField("Branch and Semester", "branchSem")}
              </div>
              <div className="flex flex-col sm:flex-row w-full gap-4">
                {renderRadioButtons("Are you an IEEE member?", "isIeeeMember", [
                  { value: "true", label: "Yes", defaultChecked: true },
                  { value: "false", label: "No" }
                ])}
                {isMember && renderFormField("IEEE Membership ID", "ieeeId")}
              </div>
              {isMember && (
                <div className="flex flex-col sm:flex-row w-full gap-4">
                  {renderRadioButtons("Are you an RAS member?", "isRasMember", [
                    { value: "true", label: "Yes", defaultChecked: true },
                    { value: "false", label: "No" }
                  ])}
                  {renderFormField("Referral Code", "coupon", "text", false)}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-center">
            <button
              type="submit"
              className="btn btn-sm h-9 w-44 rounded-full text-white border border-[#505459] bg-gradient-to-r from-[rgba(136,158,175,0.8)] to-[rgba(27,30,32,0.744)]"
            >
              Continue
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Register;