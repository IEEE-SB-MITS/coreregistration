import React, { useState } from "react";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, getStorage } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import db from "../../utils/config";

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
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
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
    
            console.log("Document written with ID: ", docRef);
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
    <div className="register-form h-full p-4 pt-0">
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
  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <input
      type="text"
      name="firstName"
      placeholder="First Name"
      onChange={handleChange}
      value={formData.firstName}
      required
      className="input-field w-full md:col-span-1 col-span-2"
    />
    <input
      type="text"
      name="lastName"
      placeholder="Last Name"
      onChange={handleChange}
      value={formData.lastName}
      required
      className="input-field w-full md:col-span-1 col-span-2"
    />
    <input
      type="email"
      name="email"
      placeholder="Email"
      onChange={handleChange}
      value={formData.email}
      required
      className="input-field w-full md:col-span-1 col-span-2"
    />
    <input
      type="text"
      name="phoneNumber"
      placeholder="Phone Number"
      onChange={handleChange}
      value={formData.phoneNumber}
      required
      className="input-field w-full md:col-span-1 col-span-2"
    />

    <label className="col-span-2">Food Preference:</label>
    <select
      name="veg"
      onChange={handleChange}
      value={formData.veg}
      className="input-field w-full col-span-2"
    >
      <option value="Veg">Veg</option>
      <option value="Non-Veg">Non-Veg</option>
    </select>

    <div className="col-span-2 flex items-center">
      <input
        type="checkbox"
        name="ieeeMember"
        onChange={handleChange}
        checked={formData.ieeeMember}
        className="mr-2"
      />
      <label>IEEE Member?</label>
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
          className="input-field w-full col-span-1"
        />
        <div className="col-span-1 flex items-center">
          <input
            type="checkbox"
            name="rasMember"
            onChange={handleChange}
            checked={formData.rasMember}
            className="mr-2"
          />
          <label>RAS Member?</label>
        </div>
      </>
    )}
    <input
      type="text"
      name="college"
      placeholder="College"
      onChange={handleChange}
      value={formData.college}
      required
      className="input-field w-full col-span-2"
    />
    <input
      type="text"
      name="branch"
      placeholder="Branch"
      onChange={handleChange}
      value={formData.branch}
      required
      className="input-field w-full col-span-2"
    />
    <input
      type="text"
      name="semester"
      placeholder="Semester"
      onChange={handleChange}
      value={formData.semester}
      required
      className="input-field w-full col-span-2"
    />
    <input
      type="text"
      name="referralCode"
      placeholder="Referral Code (Optional)"
      onChange={handleChange}
      value={formData.referralCode}
      className="input-field w-full col-span-2"
    />

    <button type="submit" className="btn-primary w-full col-span-2">
      Next
    </button>
  </form>
);

const PartTwoForm = ({ formData, handleChange, handleSubmit, loading }) => (
  <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
    <h2 className="text-xl font-bold mb-4">Register (Part 2)</h2>

    <input
      type="text"
      name="transactionId"
      placeholder="Transaction ID"
      onChange={handleChange}
      value={formData.transactionId}
      required
      className="input-field w-full"
    />
    <input
      type="file"
      name="paymentScreenshot"
      accept="image/*"
      onChange={handleChange}
      required
      className="input-field w-full"
    />

    <button type="submit" className="btn-primary w-full" disabled={loading}>
      {loading ? "Loading..." : "Submit"}
    </button>
  </form>
);

export default Register;