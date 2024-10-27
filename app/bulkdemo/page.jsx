"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { doc, updateDoc, getDoc, collection, addDoc, writeBatch } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import db from "../../utils/config";

export default function Component() {
    const storage = getStorage(); 
  const [teamLead, setTeamLead] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    branch: '',
    college: '',
    semester: '',
  });
  const [teamMembers, setTeamMembers] = useState([]);
  const [totalAmount, setTotalAmount] = useState(1000);
  const [showQR, setShowQR] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [paymentScreenshotUrl, setPaymentScreenshotUrl] = useState('');

  const handleTeamLeadChange = (event) => {
    const { name, value } = event.target;
    setTeamLead((prev) => ({ ...prev, [name]: value }));
  };

  const handleTransactionIdChange = (event) => {
    setTransactionId(event.target.value);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const storageRef = ref(storage, `paymentScreenshots/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setPaymentScreenshotUrl(url);
    }
  };

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, {
      firstName: '',
      lastName: '',
      branch: '',
      college: '',
      semester: '',
    }]);
  };

  const removeTeamMember = (index) => {
    const updatedMembers = teamMembers.filter((_, i) => i !== index);
    setTeamMembers(updatedMembers);
  };

  const handleTeamMemberChange = (index, event) => {
    const { name, value } = event.target;
    const updatedMembers = [...teamMembers];
    updatedMembers[index] = { ...updatedMembers[index], [name]: value };
    setTeamMembers(updatedMembers);
  };

  useEffect(() => {
    const totalMembers = teamMembers.length + 1;
    const freeEntries = Math.floor(totalMembers / 6);
    const paidEntries = totalMembers - freeEntries;
    setTotalAmount(paidEntries * 1000);
  }, [teamMembers]);

  const handleContinue = () => {
    setShowQR(true);
  };

  const handlePaymentComplete = async () => {
    setShowQR(false);

    const ticketRef = doc(db, "tickets", "currentTicket");
    const ticketSnap = await getDoc(ticketRef);
    let currentTicketNumber = ticketSnap.data().ticketNumber;

    const teamData = {
      teamLead: { 
        ...teamLead, 
        ticketNumber: currentTicketNumber, 
        role: "Team Lead", 
        transactionId, 
        paymentScreenshot: paymentScreenshotUrl 
      },
      teamMembers: teamMembers.map((member) => ({
        ...member,
        ticketNumber: ++currentTicketNumber,
        role: "Team Member",
      })),
      totalAmount,
      timestamp: new Date(),
    };

    const batch = writeBatch(db);
    const leaderDocRef = doc(db, "registrations", `${teamLead.firstName}_${teamLead.lastName}`);

    batch.set(leaderDocRef, teamData);
    batch.update(ticketRef, { ticketNumber: currentTicketNumber + 1 });

    try {
      await batch.commit();
      console.log("Registration data and ticket numbers updated successfully");
    } catch (error) {
      console.error("Error completing registration:", error);
    }
  
    setRegistrationComplete(true);
  };

  return (
    <div className="container mx-auto p-4 ">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Bulk Registration</CardTitle>
          <CardDescription>Register your team for the event</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Team Lead</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="leadFirstName">First Name</Label>
                  <Input id="leadFirstName" name="firstName" value={teamLead.firstName} onChange={handleTeamLeadChange} required />
                </div>
                <div>
                  <Label htmlFor="leadLastName">Last Name</Label>
                  <Input id="leadLastName" name="lastName" value={teamLead.lastName} onChange={handleTeamLeadChange} required />
                </div>
              </div>
              <div>
                <Label htmlFor="leadEmail">Email</Label>
                <Input id="leadEmail" name="email" type="email" value={teamLead.email} onChange={handleTeamLeadChange} required />
              </div>
              <div>
                <Label htmlFor="leadPhone">Phone</Label>
                <Input id="leadPhone" name="phone" type="tel" value={teamLead.phone} onChange={handleTeamLeadChange} required />
              </div>
              <div>
                <Label htmlFor="leadBranch">Branch</Label>
                <Input id="leadBranch" name="branch" value={teamLead.branch} onChange={handleTeamLeadChange} required />
              </div>
              <div>
                <Label htmlFor="leadCollege">College</Label>
                <Input id="leadCollege" name="college" value={teamLead.college} onChange={handleTeamLeadChange} required />
              </div>
              <div>
                <Label htmlFor="leadSemester">Semester</Label>
                <Input id="leadSemester" name="semester" value={teamLead.semester} onChange={handleTeamLeadChange} required />
              </div>
            </div>

            {teamMembers.map((member, index) => (
              <div key={index} className="space-y-2 border-t pt-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Team Member {index + 1}</h3>
                  <Button variant="ghost" size="icon" onClick={() => removeTeamMember(index)}>
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`memberFirstName-${index}`}>First Name</Label>
                    <Input
                      id={`memberFirstName-${index}`}
                      name="firstName"
                      value={member.firstName}
                      onChange={(e) => handleTeamMemberChange(index, e)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`memberLastName-${index}`}>Last Name</Label>
                    <Input
                      id={`memberLastName-${index}`}
                      name="lastName"
                      value={member.lastName}
                      onChange={(e) => handleTeamMemberChange(index, e)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor={`memberBranch-${index}`}>Branch</Label>
                  <Input
                    id={`memberBranch-${index}`}
                    name="branch"
                    value={member.branch}
                    onChange={(e) => handleTeamMemberChange(index, e)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor={`memberCollege-${index}`}>College</Label>
                  <Input
                    id={`memberCollege-${index}`}
                    name="college"
                    value={member.college}
                    onChange={(e) => handleTeamMemberChange(index, e)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor={`memberSemester-${index}`}>Semester</Label>
                  <Input
                    id={`memberSemester-${index}`}
                    name="semester"
                    value={member.semester}
                    onChange={(e) => handleTeamMemberChange(index, e)}
                    required
                  />
                </div>
              </div>
            ))}

            <Button type="button" variant="outline" className="w-full" onClick={addTeamMember}>
              <Plus className="h-4 w-4 mr-2" /> Add Team Member
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-lg font-semibold">Total Amount: ₹{totalAmount}</div>
          <Button onClick={handleContinue}>Continue to Payment</Button>
        </CardFooter>
      </Card>

      <Dialog open={showQR} onOpenChange={setShowQR}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Scan QR Code to Pay</DialogTitle>
      <DialogDescription>
        Please scan the QR code below to complete your payment of ₹{totalAmount}.
      </DialogDescription>
    </DialogHeader>
    <div className="flex justify-center mb-4">
      <Image src="/qr.png" alt="QR Code" width={200} height={200} />
    </div>
    <div className="space-y-4">
      <Label htmlFor="transactionId">Transaction ID</Label>
      <Input
        id="transactionId"
        name="transactionId"
        value={transactionId}
        onChange={handleTransactionIdChange}
        required
      />

      <Label htmlFor="paymentScreenshot">Upload Payment Screenshot</Label>
      <Input
        id="paymentScreenshot"
        type="file"
        onChange={handleFileChange}
        required
      />
    </div>
    <DialogFooter>
      <Button onClick={handlePaymentComplete}>Payment Complete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

<Dialog open={registrationComplete} onOpenChange={setRegistrationComplete}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Thank You for Registering!</DialogTitle>
      <DialogDescription>
        Your registration is complete. We look forward to seeing you at the event.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button onClick={() => setRegistrationComplete(false)}>Close</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

    </div>
  );
}
