"use client";
import React, { useState } from "react";
import { collection, addDoc, getDoc, doc, updateDoc } from "firebase/firestore";
import db from "../utils/firebase.config.js";
import Image from "next/image";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import qr from '../../public/qr.jpg';

const Register = () => {
  const [formData, setFormData] = useState({ transactionId: "" });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const uploadFile = async (file, transactionId) => {
    try {
      const newName = `${transactionId}${file.name.substring(file.name.lastIndexOf("."))}`;
      const renamedFile = new File([file], newName, { type: file.type });
      const storage = getStorage();
      const storageRef = ref(storage, `upiscreenshots/${renamedFile.name}`);

      const snapshot = await uploadBytes(storageRef, renamedFile);
      console.log("Uploaded a blob or file!", snapshot);

      const url = await getDownloadURL(storageRef);
      setUploadedImageUrl(url);
      console.log("File available at", url);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const addData = async (formData) => {
    try {
      const ticketDocRef = doc(db, "tickets", "currentTicket");
      const ticketDoc = await getDoc(ticketDocRef);
      
      if (!ticketDoc.exists()) throw new Error("Ticket document does not exist!");

      const currentTicket = ticketDoc.data().ticketNumber;
      const nextTicket = currentTicket + 1;

      await updateDoc(ticketDocRef, { ticketNumber: nextTicket });

      const docRef = await addDoc(collection(db, "CORE"), {
        ...formData,
        status: "pending",
        ticketNumber: currentTicket,
      });
      console.log("Document written with ID: ", docRef.id);

      return true;
    } catch (error) {
      console.error("Error adding document: ", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (await addData(formData) && file) {
      await uploadFile(file, formData.transactionId);
    }

    setLoading(false);
  };

  const renderFormField = (label, name, type = "text", required = true) => (
    <div className="flex flex-col w-full sm:w-1/2">
      <label className="block text-sm pl-4 py-1">
        {label}
        {required && <span className="text-red-700">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className="input h-10 input-bordered border-2 px-4 border-white bg-[#57595d] rounded-full w-full"
        required={required}
      />
    </div>
  );

  return (
    <div className="text-white h-screen flex flex-col gap-7 items-center w-full min-h-screen max-w-screen-xl mx-auto px-4 md:px-8 overflow-auto">
      <div className="w-full max-w-md flex flex-col items-center">
        <h1 className="text-3xl font-semibold pb-2 text-[#FFFFFFD9]">Scan the QR code</h1>
        <Image src={qr} width={180} height={190} alt="QR Code" />
        
        <form className="flex flex-col w-full gap-3 text-[#FFFFFFE5]" onSubmit={handleSubmit}>
          {renderFormField("Transaction Id", "transactionId")}
          <label className="text-sm pl-4 py-1 text-left w-1/2">Upload File</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="input py-2 input-bordered border-2 px-4 border-white bg-[#57595d] rounded-full w-1/2"
          />
          
          <button
            type="submit"
            className="btn btn-sm px-16 py-2 rounded-full text-white border border-[#505459] bg-gradient-to-r from-[rgba(136,158,175,0.8)] to-[rgba(27,30,32,0.744)]"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
      </div>

      {uploadedImageUrl && (
        <div className="flex flex-col items-center mt-4">
          <h2 className="text-xl font-semibold pb-2 text-[#FFFFFFD9]">Uploaded Image</h2>
          <img src={uploadedImageUrl} alt="Uploaded" className="w-1/2" />
          <button
            onClick={() => window.location.href = `/ticket?ticketNumber=${formData.transactionId}`}
            className="btn btn-sm px-16 py-2 mt-4 rounded-full text-white border border-[#505459] bg-gradient-to-r from-[rgba(136,158,175,0.8)] to-[rgba(27,30,32,0.744)]"
          >
            Go to Ticket
          </button>
        </div>
      )}
    </div>
  );
};

export default Register;
