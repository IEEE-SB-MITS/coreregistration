"use client";
import React, { useState } from "react";
import { collection, addDoc, getDoc, doc, updateDoc } from "firebase/firestore";
import db from "../utils/firebase.config.js";
import Image from "next/image";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import qr from '../../public/qr.jpg';

const Register = () => {
  const [formData, setFormData] = useState({
    transactionId: "",
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;
    setFormData((prevData) => ({
      ...prevData,
      [name]: fieldValue,
    }));
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const renameFile = (file, transactionId) => {
    const newName = `${transactionId}${file.name.substring(file.name.lastIndexOf("."))}`;
    const renamedFile = new File(
      [file],
      newName,
      { type: file.type }
    );

    console.log("Renamed file name:", renamedFile.name);

    const storage = getStorage();
    const storageRef = ref(storage, `upiscreenshots/${renamedFile.name}`);

    uploadBytes(storageRef, renamedFile)
      .then((snapshot) => {
        console.log("Uploaded a blob or file!", snapshot);
        return getDownloadURL(storageRef);
      })
      .then((url) => {
        setUploadedImageUrl(url);
        console.log("File available at", url);
      })
      .catch((error) => console.error("Error uploading file:", error));
  };

  async function addData(formData) {
    try {
      const ticketDocRef = doc(db, "tickets", "currentTicket");
      const ticketDoc = await getDoc(ticketDocRef);
      if (!ticketDoc.exists()) {
        throw new Error("Ticket document does not exist!");
      }
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
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await addData(formData);

    if (success) {
      if (file) {
        renameFile(file, formData.transactionId);
      }
    } else {
      console.error("Error adding data");
    }
    setLoading(false);
  };

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

  return (
    <div className="text-white h-screen flex flex-col gap-7 items-center w-full min-h-screen  md:overflow-hidden max-w-screen-xl mx-auto px-4 md:px-8 overflow-auto">
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="text-3xl font-semibold pb-2 text-[#FFFFFFD9]">
          Scan the QR code
        </div>
        <div className="flex flex-col justify-center gap-3 text-[#FFFFFFE5] w-full">
          <div className="flex flex-col justify-center items-center">
            <Image src={qr} width="180" height="190" />
          </div>
          <div className="flex flex-col justify-center items-center w-full">
            {renderFormField("Transaction Id", "transactionId")}
            <label className="text-sm pl-4 py-1 text-left w-1/2">Upload File</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="input py-2 input-bordered border-2 px-4 border-white bg-[#57595d] rounded-full w-1/2"
            />
          </div>
          <div className="flex flex-col justify-center items-center w-full">
            <button
              className="btn btn-sm px-16 py-2 flex rounded-full text-white border border-[#505459] bg-gradient-to-r from-[rgba(136,158,175,0.8)] to-[rgba(27,30,32,0.744)]"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </div>
        </div>
      </div>
      {uploadedImageUrl && (
        <div className="flex flex-col items-center">
          <div className="text-xl font-semibold pb-2 text-[#FFFFFFD9]">
            Uploaded Image
          </div>
          <img src={uploadedImageUrl} alt="Uploaded" className="w-1/2" />
          <button
            className="btn btn-sm px-16 py-2 flex rounded-full text-white border border-[#505459] bg-gradient-to-r from-[rgba(136,158,175,0.8)] to-[rgba(27,30,32,0.744)] mt-4"
            onClick={() => window.location.href = `/ticket?ticketNumber=${formData.transactionId}`}
          >
            Go to Ticket
          </button>
        </div>
      )}
    </div>
  );
};

export default Register;