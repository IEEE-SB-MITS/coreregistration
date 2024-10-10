import React, { useState } from "react";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, getStorage } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import db from "../../utils/config";
import Image from "next/image";
import Qr from '../../public/qr.png';
const initialFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  veg: "Veg",
  ieeeMember: false,
  ieeeMembershipId: "",
  rasMember: false,
  college: "",
  branch: "",
  semester: "",
  transactionId: "",
  paymentScreenshot: null,
  referralCode: "",
  status: "pending",
};

const Register = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [partTwo, setPartTwo] = useState(false);
  const storage = getStorage();

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    const newValue = value === "true" || value === "false" ? value === "true" : value;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : newValue,
    }));

    console.log(formData)
  };

  const validatePartOne = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phoneNumber', 'college', 'branch', 'semester'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return false;
    }

    if (formData.ieeeMember && !formData.ieeeMembershipId) {
      toast.error("Please provide your IEEE Membership ID");
      return false;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      toast.error("Enter a valid 10-digit phone number.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Enter a valid email address.");
      return false;
    }
    
    return true;
  };

  const handleSubmitPartOne = (e) => {
    e.preventDefault();
    if (validatePartOne()) setPartTwo(true);
  };

  const uploadScreenshot = async () => {
    const paymentScreenshotId = `${formData.transactionId}-${uuidv4()}`;
    const screenshotRef = ref(storage, `screenshots/${paymentScreenshotId}`);
    const uploadTask = uploadBytesResumable(screenshotRef, formData.paymentScreenshot);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        reject,
        async () => {
          const screenshotUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(screenshotUrl);
        }
      );
    });
  };

  const getNextTicketNumber = async () => {
    const ticketDocRef = doc(db, "tickets", "currentTicket");
    const ticketDoc = await getDoc(ticketDocRef);

    if (!ticketDoc.exists()) {
      throw new Error("Ticket document does not exist!");
    }

    const currentTicketNumber = ticketDoc.data().ticketNumber;
    await updateDoc(ticketDocRef, { ticketNumber: currentTicketNumber + 1 });

    return currentTicketNumber;
  };

  const saveRegistrationData = async (screenshotUrl, ticketNumber) => {
    const userId = uuidv4();
    await setDoc(doc(db, "CORE", userId), {
      ...formData,
      paymentScreenshotUrl: screenshotUrl,
      ticketNumber,
    });
  };

      const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
    
      try {
        if (!formData.transactionId || !formData.paymentScreenshot) {
          setLoading(false);
          return toast.error(
            "Please provide transaction ID and upload payment screenshot"
          );
        }
    
        const paymentScreenshotId = `${formData.transactionId}-${uuidv4()}`;
        const screenshotRef = ref(storage, `screenshots/${paymentScreenshotId}`);
    
        const uploadTask = uploadBytesResumable(
          screenshotRef,
          formData.paymentScreenshot
        );
    
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
          },
          (error) => {
            console.error(error);
            setLoading(false);
            toast.error("File upload failed");
          },
          async () => {
            const screenshotUrl = await getDownloadURL(uploadTask.snapshot.ref);
    
            // Remove the paymentScreenshot field from formData
            const { paymentScreenshot, ...formDataWithoutFile } = formData;
    
            // Ticketing logic
            const ticketDocRef = doc(db, "tickets", "currentTicket");
            const ticketDoc = await getDoc(ticketDocRef);
    
            if (!ticketDoc.exists()) {
              throw new Error("Ticket document does not exist!");
            }
    
            const currentTicket = ticketDoc.data().ticketNumber;
            const nextTicket = currentTicket + 1;
    
            // Update ticket number in Firestore
            await updateDoc(ticketDocRef, { ticketNumber: nextTicket });
    
            // Generate a unique userId
            const userId = uuidv4();
    
            // Save registration data in the CORE collection
            const docRef = await setDoc(doc(db, "CORE", userId), {
              ...formDataWithoutFile,
              paymentScreenshotUrl: screenshotUrl, // Store the URL here
              ticketNumber: currentTicket,
            });
    
            setLoading(false);
            toast.success("Registration successful");
            setFormData({
              firstName: "",
              lastName: "",
              email: "",
              phoneNumber: "",
              veg: "Veg",
              ieeeMember: false,
              ieeeMembershipId: "",
              rasMember: false,
              college: "",
              branch: "",
              semester: "",
              transactionId: "",
              paymentScreenshot: null,
              referralCode: "",
            });
            
            // Redirect to ticket page
            window.location.href = `/ticket?ticketNumber=${currentTicket}`;
          }
        );
      } catch (error) {
        console.error("Error saving document:", error);
        setLoading(false);
        toast.error("Registration failed");
      }
    };

  return (
    <div className="register-form  h-full p-4 pt-0 w-full">
      {!partTwo ? (
        <PartOneForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmitPartOne}
        />
      ) : (
        <PartTwoForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={loading}
        />
      )}
    </div>
  );
};

const PartOneForm = ({ formData, handleChange, handleSubmit }) => (
  <form onSubmit={handleSubmit} className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
    <div className="text-2xl font-semibold text-[#FFFFFFD9] col-span-2 -mb-2">Student Details</div>
    <label className='block md:col-span-1 col-span-2'>
    <span class="after:content-['*'] after:ml-0.5 after:text-red-700 block text-sm pl-4 py-1">
        First Name
      </span>
      <input
        type="text"
        name="firstName"
        onChange={handleChange}
        value={formData.firstName}
        required
        className="pl-3 w-full input h-9 input-bordered border-2 border-[#E3E3E3] bg-[#57595d] rounded-full focus:outline-none required"
      />
    </label>

    <label className='block md:col-span-1 col-span-2'>
      <span class="after:content-['*'] after:ml-0.5 after:text-red-700 block text-sm pl-4 py-1">
        Last Name
      </span>
      <input
        type="text"
        name="lastName"
        onChange={handleChange}
        value={formData.lastName}
        required
        className="pl-3 w-full input h-9 input-bordered border-2 border-[#E3E3E3] bg-[#57595d] rounded-full focus:outline-none  required"
      />
    </label>

    <label className='block md:col-span-1 col-span-2'>
      <span class="after:content-['*'] after:ml-0.5 after:text-red-700 block text-sm pl-4 py-1">
        Email ID
      </span>
      <input
        type="email"
        name="email"
        onChange={handleChange}
        value={formData.email}
        required
        className="pl-3 w-full md:col-span-1 col-span-2 input h-9 input-bordered border-2 border-[#E3E3E3] bg-[#57595d] rounded-full focus:outline-none  required"
      />
    </label>

    <label className="block md:col-span-1 col-span-2">
      <span class="after:content-['*'] after:ml-0.5 after:text-red-700 block text-sm pl-4 py-1">
        Phone Number
      </span>
      <input
        type="text"
        name="phoneNumber"
        onChange={handleChange}
        value={formData.phoneNumber}
        required
        className="pl-3 w-full md:col-span-1 col-span-2 input h-9 input-bordered border-2 border-[#E3E3E3] bg-[#57595d] rounded-full focus:outline-none  required"
      />
    </label>

    <label className="block md:col-span-1 col-span-2">
      <span class="after:content-['*'] after:ml-0.5 after:text-red-700 block text-sm pl-4 py-1">
      Food Preference:
      </span>
    
      <select
        name="veg"
        onChange={handleChange}
        value={formData.veg}
        className="px-3 w-full input h-9 input-bordered border-2 border-[#E3E3E3] bg-[#57595d] rounded-lg focus:outline-none  required"
      >
        <option value="Veg">Veg</option>
        <option value="Non-Veg">Non-Veg</option>
      </select>
    </label>


    <div className="flex flex-col col-span-1 space-y-2 ml-5 mt-2">
    <label className="after:content-['*'] after:ml-0.5 after:text-red-700">Are you an IEEE Member?</label>
      <div className="flex space-x-6">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="ieeeMember"
            value="true"
            checked={formData.ieeeMember}
            onChange={handleChange}
            className="rounded-full h-6 w-6 border-4 appearance-none  border-gray-300 checked:bg-blue-600 checked:border-white focus:outline-none"
          />
          <span className="text-white text-sm font-medium">Yes</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="ieeeMember"
            value="false"
            checked={!formData.ieeeMember}
            onChange={handleChange}
            className="rounded-full h-6 w-6 border-4 appearance-none  border-gray-300 checked:bg-blue-600 checked:border-white focus:outline-none"
          />
          <span className="text-white text-sm font-medium">No</span>
        </label>
      </div>
    </div>

    {formData.ieeeMember && (
      <>
        <input
          type="text"
          name="ieeeMembershipId"
          placeholder="IEEE Membership ID"
          onChange={handleChange}
          value={formData.ieeeMembershipId}
          required
          className="pl-3 mt-2 w-full md:col-span-1 col-span-2 input h-9 input-bordered border-2 border-[#E3E3E3] bg-[#57595d] placeholder:text-gray-300 rounded-full focus:outline-none required"
        />
        <div className="col-span-1 flex items-center ml-5 mt-2">
          <input
            type="checkbox"
            name="rasMember"
            onChange={handleChange}
            checked={formData.rasMember}
            className="h-5 w-5 mr-3"
          />
          <label>RAS Member?</label>
        </div>
      </>
    )}

    <div className="text-2xl font-semibold text-[#FFFFFFD9] col-span-2 mt-4 -mb-2">College Details</div>
    <label className="block md:col-span-1 col-span-2">
      <span class="after:content-['*'] after:ml-0.5 after:text-red-700 block text-sm pl-4 py-1">
        College Name
      </span>
      <input
        type="text"
        name="college"
        onChange={handleChange}
        value={formData.college}
        required
        className="pl-3 w-full input h-9 input-bordered border-2 border-[#E3E3E3] bg-[#57595d] rounded-full focus:outline-none required"
      />
    </label>

    <label className="block md:col-span-1 col-span-2">
      <span class="after:content-['*'] after:ml-0.5 after:text-red-700 block text-sm pl-4 py-1">
        Branch
      </span>
      <input
        type="text"
        name="branch"
        onChange={handleChange}
        value={formData.branch}
        required
        className="pl-3 w-full input h-9 input-bordered border-2 border-[#E3E3E3] bg-[#57595d] rounded-full focus:outline-none required"
      />
    </label>

    <label className="block md:col-span-1 col-span-2">
      <span class="after:content-['*'] after:ml-0.5 after:text-red-700 block text-sm pl-4 py-1">
        Semester
      </span>
      <input
        type="text"
        name="semester"
        onChange={handleChange}
        value={formData.semester}
        required
        className="pl-3 w-full input h-9 input-bordered border-2 border-[#E3E3E3] bg-[#57595d] rounded-full focus:outline-none required"
      />
    </label>

    <label className="block md:col-span-1 col-span-2">
      <span class="block text-sm pl-4 py-1">
        Referral Code (Optional)
      </span>
      <input
        type="text"
        name="referralCode"
        onChange={handleChange}
        value={formData.referralCode}
        className="pl-3 w-full input h-9 input-bordered border-2 border-[#E3E3E3] bg-[#57595d] rounded-full focus:outline-none "
      />
    </label>


    <button type="submit" 
      className="btn btn-sm h-9 w-44 col-span-2 rounded-full text-white border border-[#505459] justify-self-center mt-3"
      style={{
        background: `linear-gradient(90deg, rgba(136, 158, 175, 0.8) 0%, rgba(27, 30, 32, 0.744) 98.32%)`,
      }}>
      PAY NOW
    </button>
  </form>
);

const PartTwoForm = ({ formData, handleChange, handleSubmit, loading }) => (
  <form onSubmit={handleSubmit} className="flex flex-col grid-cols-1  items-center justify-center gap-4">
    <h2 className="text-xl font-bold mb-4">Register (Part 2)</h2>

<Image src={Qr} alt="QR" width={200} height={200}/>
<span className="text-white text-sm">Scan the QR code to make payment</span>

    <input
      type="text"
      name="transactionId"
      placeholder="Transaction ID"
      onChange={handleChange}
      value={formData.transactionId}
      required
      className="input-field text-black w-full"
    />
    <input
      type="file"
      name="paymentScreenshot"
      accept="image/*"
      onChange={handleChange}
      required
      className="input-field w-full"
    />

    <button type="submit" className="flex items-center bg-slate-500 text-white gap-1 px-4 py-2 cursor-pointer text-gray-800 font-semibold tracking-widest rounded-md hover:bg-gray-400 duration-300 hover:gap-2 hover:translate-x-3" disabled={loading}>
      {loading ? "Loading..." : "Submit"}
    </button>
  </form>
);

export default Register;