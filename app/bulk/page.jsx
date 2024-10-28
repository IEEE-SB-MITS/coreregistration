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
    { firstName: '', lastName: '', branch: '', college: '', semester: '' },
  ]);
  const [membershipConfirmed, setMembershipConfirmed] = useState(false);
  const [teamLead, setTeamLead] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    branch: '',
    college: '',
    semester: '',
  })
  const [teamMembers, setTeamMembers] = useState([])
  const [totalAmount, setTotalAmount] = useState(1000)
  const [showQR, setShowQR] = useState(false)
  const [registrationComplete, setRegistrationComplete] = useState(false)
  const [transactionId, setTransactionId] = useState('')
  const [paymentScreenshot, setPaymentScreenshot] = useState(null)
  const [paymentScreenshotUrl, setPaymentScreenshotUrl] = useState('')
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false)
  const [newMember, setNewMember] = useState({
    firstName: '',
    lastName: '',
    branch: '',
    college: '',
    semester: '',
  })

  const handleTeamLeadChange = (event) => {
    const { name, value } = event.target
    setTeamLead((prev) => ({ ...prev, [name]: value }))
  }

  const handleTransactionIdChange = (event) => {
    setTransactionId(event.target.value)
  }

  const handleFileChange = async (event) => {
    const file = event.target.files[0]
    if (file) {
      const storageRef = ref(storage, `paymentScreenshots/${file.name}`)
      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)
      setPaymentScreenshotUrl(url)
    }
  }

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, newMember])
    setNewMember({
      firstName: '',
      lastName: '',
      branch: '',
      college: '',
      semester: '',
    })
    setShowAddMemberDialog(false)
  }

  const removeTeamMember = (index) => {
    const updatedMembers = teamMembers.filter((_, i) => i !== index)
    setTeamMembers(updatedMembers)
  }

  const handleNewMemberChange = (event) => {
    const { name, value } = event.target
    setNewMember((prev) => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    const totalMembers = teamMembers.length + 1
    const freeEntries = Math.floor(totalMembers / 6)
    const paidEntries = totalMembers - freeEntries
    setTotalAmount(paidEntries * 1000)
  }, [teamMembers])

  const handleContinue = () => {
    setShowQR(true)
  }

  const handlePaymentComplete = async () => {
    setShowQR(false)

    const ticketRef = doc(db, "tickets", "currentTicket")
    const ticketSnap = await getDoc(ticketRef)
    let currentTicketNumber = ticketSnap.data().ticketNumber

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
    }

    const batch = writeBatch(db)
    const leaderDocRef = doc(db, "bulkregistrations", `${teamLead.firstName}_${teamLead.lastName}`)

    batch.set(leaderDocRef, teamData)
    batch.update(ticketRef, { ticketNumber: currentTicketNumber + 1 })

    try {
      await batch.commit()
      console.log("Registration data and ticket numbers updated successfully")
    } catch (error) {
      console.error("Error completing registration:", error)
    }
  
    setRegistrationComplete(true)
  }

  return (
    <div className="container mx-auto p-4 bg-neutral-900 text-white min-w-full min-h-screen flex justify-center items-center">
      <Card className="w-full max-w-2xl mx-auto bg-neutral-800 text-white border-neutral-700">
        <CardHeader>
          <CardTitle>Bulk Registration</CardTitle>
          <CardDescription className="text-neutral-400">Register your team for the event</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Team Lead</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="leadFirstName">First Name</Label>
                  <Input className="bg-neutral-700" id="leadFirstName" name="firstName" value={teamLead.firstName} onChange={handleTeamLeadChange} required />
                </div>
                <div>
                  <Label htmlFor="leadLastName">Last Name</Label>
                  <Input className="bg-neutral-700" id="leadLastName" name="lastName" value={teamLead.lastName} onChange={handleTeamLeadChange} required />
                </div>
              </div>
              <div>
                <Label htmlFor="leadEmail">Email</Label>
                <Input className="bg-neutral-700" id="leadEmail" name="email" type="email" value={teamLead.email} onChange={handleTeamLeadChange} required />
              </div>
              <div>
                <Label htmlFor="leadPhone">Phone</Label>
                <Input className="bg-neutral-700" id="leadPhone" name="phone" type="tel" value={teamLead.phone} onChange={handleTeamLeadChange} required />
              </div>
              <div>
                <Label htmlFor="leadBranch">Branch</Label>
                <Input className="bg-neutral-700" id="leadBranch" name="branch" value={teamLead.branch} onChange={handleTeamLeadChange} required />
              </div>
              <div>
                <Label htmlFor="leadCollege">College</Label>
                <Input className="bg-neutral-700" id="leadCollege" name="college" value={teamLead.college} onChange={handleTeamLeadChange} required />
              </div>
              <div>
                <Label htmlFor="leadSemester">Semester</Label>
                <Input className="bg-neutral-700" id="leadSemester" name="semester" value={teamLead.semester} onChange={handleTeamLeadChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Team Members</h3>
              <div className="grid grid-cols-2 gap-4">
                {teamMembers.map((member, index) => (
                  <Card key={index} className="bg-neutral-700 border-neutral-600">
                    <CardHeader className="p-4">
                      <CardTitle className="text-sm flex justify-between items-center">
                        <span>{member.firstName} {member.lastName}</span>
                        <Button variant="ghost" size="icon" onClick={() => removeTeamMember(index)} className="h-6 w-6">
                          <Minus className="h-4 w-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-xs text-neutral-400">{member.branch}, {member.college}, Semester {member.semester}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
                <Button type="button" variant="outline" className="w-full bg-neutral-700 text-white hover:bg-neutral-600" onClick={() => setShowAddMemberDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Add Team Member
                </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-lg font-semibold">Total Amount: ₹{totalAmount}</div>
          <Button onClick={handleContinue} className="bg-white text-black hover:bg-neutral-200">Continue to Payment</Button>
        </CardFooter>
      </Card>

      <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
        <DialogContent className="bg-neutral-800 text-white">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="newMemberFirstName">First Name</Label>
                <Input className="bg-neutral-700" id="newMemberFirstName" name="firstName" value={newMember.firstName} onChange={handleNewMemberChange} required />
              </div>
              <div>
                <Label htmlFor="newMemberLastName">Last Name</Label>
                <Input className="bg-neutral-700" id="newMemberLastName" name="lastName" value={newMember.lastName} onChange={handleNewMemberChange} required />
              </div>
            </div>
            <div>
              <Label htmlFor="newMemberBranch">Branch</Label>
              <Input className="bg-neutral-700" id="newMemberBranch" name="branch" value={newMember.branch} onChange={handleNewMemberChange} required />
            </div>
            <div>
              <Label htmlFor="newMemberCollege">College</Label>
              <Input className="bg-neutral-700" id="newMemberCollege" name="college" value={newMember.college} onChange={handleNewMemberChange} required />
            </div>
            <div>
              <Label htmlFor="newMemberSemester">Semester</Label>
              <Input className="bg-neutral-700" id="newMemberSemester" name="semester" value={newMember.semester} onChange={handleNewMemberChange} required />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={addTeamMember} className="bg-white text-black hover:bg-neutral-200">Add Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent className="bg-neutral-800 text-white">
          <DialogHeader>
            <DialogTitle>Scan QR Code to Pay</DialogTitle>
            <DialogDescription className="text-neutral-400">
              Please scan the QR code below to complete your payment of ₹{totalAmount}.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mb-4">
            <Image src="/qr.png" alt="QR Code" width={200} height={200} />
          </div>
          <div className="space-y-4">
            <Label htmlFor="transactionId">Transaction ID</Label>
            <Input className="bg-neutral-700"
              id="transactionId"
              name="transactionId"
              value={transactionId}
              onChange={handleTransactionIdChange}
              required
            />

            <Label htmlFor="paymentScreenshot">Upload Payment Screenshot</Label>
            <Input className="bg-neutral-700"
              id="paymentScreenshot"
              type="file"
              onChange={handleFileChange}
              required
            />
          </div>
          <DialogFooter>
            <Button onClick={handlePaymentComplete} className="bg-white text-black hover:bg-neutral-200">Payment Complete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={registrationComplete} onOpenChange={setRegistrationComplete}>
        <DialogContent className="bg-neutral-800 text-white">
          <DialogHeader>
            <DialogTitle>Thank You for Registering!</DialogTitle>
            <DialogDescription className="text-neutral-400">
              Your registration is complete. We look forward to seeing you at the event.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setRegistrationComplete(false)} className="bg-white text-black hover:bg-neutral-200">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}