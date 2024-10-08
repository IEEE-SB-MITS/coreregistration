import React, { useState } from 'react';
import db from '../../utils/config';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify'; // For alerts, if you have react-toastify
import { getStorage } from 'firebase/storage';

const Register = () => {
  const storage = getStorage();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    veg: 'Veg',
    ieeeMember: false,
    ieeeMembershipId: '',
    rasMember: false,
    college: '',
    branch: '',
    semester: '',
    transactionId: '',
    paymentScreenshot: null,
  });

  const [loading, setLoading] = useState(false);
  const [partTwo, setPartTwo] = useState(false); // To switch between forms

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFormData({ ...formData, paymentScreenshot: e.target.files[0] });
    }
  };

  const handleSubmitPartOne = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phoneNumber || !formData.college || !formData.branch || !formData.semester) {
      return toast.error("Please fill in all required fields!");
    }

    if (formData.ieeeMember && !formData.ieeeMembershipId) {
      return toast.error("Please provide your IEEE Membership ID");
    }

    setPartTwo(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.transactionId || !formData.paymentScreenshot) {
        setLoading(false);
        return toast.error('Please provide transaction ID and upload payment screenshot');
      }

      const paymentScreenshotId = `${formData.transactionId}-${uuidv4()}`;
      const screenshotRef = ref(storage, `screenshots/${paymentScreenshotId}`);

      const uploadTask = uploadBytesResumable(screenshotRef, formData.paymentScreenshot);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.error(error);
          setLoading(false);
          toast.error('File upload failed');
        },
        async () => {
          const screenshotUrl = await getDownloadURL(uploadTask.snapshot.ref);

          // Save data to Firestore
          const userId = uuidv4(); // Generate unique ID for Firestore
          await setDoc(doc(db, 'users', userId), {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            veg: formData.veg,
            ieeeMember: formData.ieeeMember,
            ieeeMembershipId: formData.ieeeMembershipId,
            rasMember: formData.rasMember,
            college: formData.college,
            branch: formData.branch,
            semester: formData.semester,
            transactionId: formData.transactionId,
            paymentScreenshotUrl: screenshotUrl,
          });

          setLoading(false);
          toast.success('Registration successful');
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            veg: 'Veg',
            ieeeMember: false,
            ieeeMembershipId: '',
            rasMember: false,
            college: '',
            branch: '',
            semester: '',
            transactionId: '',
            paymentScreenshot: null,
          });
        }
      );
    } catch (error) {
      console.error('Error saving document:', error);
      setLoading(false);
      toast.error('Registration failed');
    }
  };

  return (
    <div className="register-form mx-auto p-4">
      {!partTwo ? (
        <form onSubmit={handleSubmitPartOne} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <h2 className="col-span-2 text-xl font-bold mb-4">Register (Part 1)</h2>

          <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} value={formData.firstName} required className="input-field" />
          <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} value={formData.lastName} required className="input-field" />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} value={formData.email} required className="input-field" />
          <input type="text" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} value={formData.phoneNumber} required className="input-field" />

          <label className="col-span-2">Food Preference:</label>
          <select name="veg" onChange={handleChange} value={formData.veg} className="input-field col-span-2">
            <option value="Veg">Veg</option>
            <option value="Non-Veg">Non-Veg</option>
          </select>

          <label className="col-span-2">IEEE Member?</label>
          <input type="checkbox" name="ieeeMember" onChange={handleChange} checked={formData.ieeeMember} className="col-span-2" />

          {formData.ieeeMember && (
            <>
              <input type="text" name="ieeeMembershipId" placeholder="IEEE Membership ID" onChange={handleChange} value={formData.ieeeMembershipId} required className="input-field col-span-2" />
              <label className="col-span-2">RAS Member?</label>
              <input type="checkbox" name="rasMember" onChange={handleChange} checked={formData.rasMember} className="col-span-2" />
            </>
          )}

          <input type="text" name="college" placeholder="College" onChange={handleChange} value={formData.college} required className="input-field col-span-2" />
          <input type="text" name="branch" placeholder="Branch" onChange={handleChange} value={formData.branch} required className="input-field col-span-2" />
          <input type="text" name="semester" placeholder="Semester" onChange={handleChange} value={formData.semester} required className="input-field col-span-2" />

          <button type="submit" className="btn-primary col-span-2">Next</button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <h2 className="text-xl font-bold mb-4">Register (Part 2)</h2>

          <input type="text" name="transactionId" placeholder="Transaction ID" onChange={handleChange} value={formData.transactionId} required className="input-field" />
          <input type="file" accept="image/*" onChange={handleFileChange} required className="input-field" />

          {loading ? <p>Loading...</p> : <button type="submit" className="btn-primary">Submit</button>}
        </form>
      )}
    </div>
  );
};

export default Register;
