'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Plus, Minus, User, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { doc, updateDoc, getDoc, collection, addDoc, writeBatch } from "firebase/firestore"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { useRouter } from 'next/navigation'
import db from "../../utils/config"

export default function Component() {
  const router = useRouter()
  const storage = getStorage()
  const [teamLead, setTeamLead] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    branch: '',
    college: '',
    semester: '',
    status: 'pending',
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
  const [isLoading, setIsLoading] = useState(false)
  const [warningMessage, setWarningMessage] = useState('')

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
    if (!transactionId || !paymentScreenshotUrl) {
      setWarningMessage("Please upload both the transaction ID and payment screenshot before continuing.")
      return
    }
    setIsLoading(true)
    setShowQR(false)
    setWarningMessage('')


    try {
      const teamLeadRef = doc(db, "bulkregistrations", `${teamLead.firstName}_${teamLead.lastName}`)
      const teamLeadDoc = await getDoc(teamLeadRef)

      if (teamLeadDoc.exists()) {
        setWarningMessage("This team lead is already registered. Please use a different team lead.")
        setIsLoading(false)
        return
      }

      const ticketRef = doc(db, "tickets", "currentTicket")
      const ticketSnap = await getDoc(ticketRef)
      let currentTicketNumber = ticketSnap.data().ticketNumber

      const teamData = {
        teamLead: { 
          ...teamLead, 
          ticketNumber: currentTicketNumber, 
          role: "Team Lead", 
          transactionId, 
          paymentScreenshot: paymentScreenshotUrl, // Save the paymentScreenshot URL here
          status: 'pending',
        },
        teamMembers: teamMembers.map((member) => ({
          ...member,
          ticketNumber: ++currentTicketNumber,
          role: "Team Member",
        })),
        totalAmount,
        timestamp: new Date(),
        status: 'pending',
      }

      const batch = writeBatch(db)
      const leaderDocRef = doc(db, "bulkregistrations", `${teamLead.firstName}_${teamLead.lastName}`)

      batch.set(leaderDocRef, teamData)
      batch.update(ticketRef, { ticketNumber: currentTicketNumber + 1 })

      await batch.commit()
      console.log("Registration data and ticket numbers updated successfully")
      setRegistrationComplete(true)
    } catch (error) {
      console.error("Error completing registration:", error)
      setWarningMessage("An error occurred during registration. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 bg-neutral-900 text-white min-w-full min-h-screen flex justify-center items-center">
      <Card className="w-full max-w-2xl mx-auto bg-neutral-800 text-white border-neutral-700">
        <CardHeader>
          <CardTitle className="text-neutral-200">Bulk Registration</CardTitle>
          <CardDescription className="text-neutral-400">Register your team for the event</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-neutral-200">Team Lead</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="leadFirstName">First Name</Label>
                  <Input className="bg-neutral-700 focus:border-neutral-200" id="leadFirstName" name="firstName" value={teamLead.firstName} onChange={handleTeamLeadChange} required />
                </div>
                <div>
                  <Label htmlFor="leadLastName">Last Name</Label>
                  <Input className="bg-neutral-700 focus:border-neutral-200" id="leadLastName" name="lastName" value={teamLead.lastName} onChange={handleTeamLeadChange} required />
                </div>
              </div>
              <div>
                <Label htmlFor="leadEmail">Email</Label>
                <Input className="bg-neutral-700 focus:border-neutral-200" id="leadEmail" name="email" type="email" value={teamLead.email} onChange={handleTeamLeadChange} required />
              </div>
              <div>
                <Label htmlFor="leadPhone">Phone</Label>
                <Input className="bg-neutral-700 focus:border-neutral-200" id="leadPhone" name="phone" type="tel" value={teamLead.phone} onChange={handleTeamLeadChange} required />
              </div>
              <div>
                <Label htmlFor="leadBranch">Branch</Label>
                <Input className="bg-neutral-700 focus:border-neutral-200" id="leadBranch" name="branch" value={teamLead.branch} onChange={handleTeamLeadChange} required />
              </div>
              <div>
                <Label htmlFor="leadCollege">College</Label>
                <Input className="bg-neutral-700 focus:border-neutral-200" id="leadCollege" name="college" value={teamLead.college} onChange={handleTeamLeadChange} required />
              </div>
              <div>
                <Label htmlFor="leadSemester">Semester</Label>
                <Input className="bg-neutral-700 focus:border-neutral-200" id="leadSemester" name="semester" value={teamLead.semester} onChange={handleTeamLeadChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-neutral-200">Team Members</h3>
              <div className="grid grid-cols-2 gap-4">
                {teamMembers.map((member, index) => (
                  <Card key={index} className="bg-neutral-700 border-neutral-600">
                    <CardHeader className="p-4">
                      <CardTitle className="text-sm flex justify-between items-center">
                        <span>{member.firstName} {member.lastName}</span>
                        <Button variant="ghost" size="icon" onClick={() => removeTeamMember(index)} className="h-6 w-6 text-neutral-200 hover:text-red-300">
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
              <Button type="button" variant="outline" className="w-full bg-neutral-700 text-white hover:bg-neutral-600 hover:text-neutral-200" onClick={() => setShowAddMemberDialog(true)}>
                <Plus className="h-4 w-4 mr-2" /> Add Team Member
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between flex-col md:flex-row space-y-2">
          <div className="text-lg font-semibold">Total Amount: <span className="text-neutral-200">₹{totalAmount}</span></div>
          <Button onClick={handleContinue} className="bg-neutral-600 text-white hover:bg-red-700" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Continue to Payment
          </Button>
        </CardFooter>
        {warningMessage && (
          <div className="p-4 bg-yellow-200 text-yellow-800 rounded-b-lg">
            {warningMessage}
          </div>
        )}
      </Card>

      <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
        <DialogContent className="bg-neutral-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-neutral-200">Add Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="newMemberFirstName">First Name</Label>
                <Input className="bg-neutral-700 focus:border-neutral-200" id="newMemberFirstName" name="firstName" value={newMember.firstName} onChange={handleNewMemberChange} required />
              </div>
              <div>
                <Label htmlFor="newMemberLastName">Last Name</Label>
                <Input className="bg-neutral-700 focus:border-neutral-200" id="newMemberLastName" name="lastName" value={newMember.lastName} onChange={handleNewMemberChange} required />
              </div>
            </div>
            <div>
              <Label htmlFor="newMemberBranch">Branch</Label>
              <Input className="bg-neutral-700 focus:border-neutral-200" id="newMemberBranch" name="branch" value={newMember.branch} onChange={handleNewMemberChange} required />
            </div>
            <div>
              <Label htmlFor="newMemberCollege">College</Label>
              <Input className="bg-neutral-700 focus:border-neutral-200" id="newMemberCollege" name="college" value={newMember.college} onChange={handleNewMemberChange} required />
            </div>
            <div>
              <Label htmlFor="newMemberSemester">Semester</Label>
              <Input className="bg-neutral-700 focus:border-neutral-200" id="newMemberSemester" name="semester" value={newMember.semester} onChange={handleNewMemberChange} required />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={addTeamMember} className="bg-neutral-600 text-white hover:bg-red-700">Add Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent className="bg-neutral-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-neutral-200">Scan QR Code to Pay</DialogTitle>
            <DialogDescription className="text-neutral-400">
              Please scan the QR code below to complete your payment of <span className="text-neutral-200">₹{totalAmount}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mb-4">
            <Image src="/qr.png" alt="QR Code" width={200} height={200} />
          </div>
          <div className="space-y-4">
            <Label htmlFor="transactionId">Transaction ID</Label>
            <Input className="bg-neutral-700 focus:border-neutral-200"
              id="transactionId"
              name="transactionId"
              value={transactionId}
              onChange={handleTransactionIdChange}
              required
            />

            <Label htmlFor="paymentScreenshot">Upload Payment Screenshot</Label>
            <Input className="bg-neutral-700 focus:border-neutral-200"
              id="paymentScreenshot"
              type="file"
              onChange={handleFileChange}
              required
            />
          </div>
          <DialogFooter>
            <Button onClick={handlePaymentComplete} className="bg-neutral-600 text-white hover:bg-red-700">Payment Complete</Button>
          </DialogFooter>
          
        </DialogContent>
      </Dialog>

      <Dialog open={registrationComplete} onOpenChange={setRegistrationComplete}>
        <DialogContent className="bg-neutral-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-neutral-200">Thank You for Registering!</DialogTitle>
            <DialogDescription className="text-neutral-400">
              Your registration is  complete. We look forward to seeing you at the event.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => {
              setRegistrationComplete(false)
              router.push('/bulk/tickets')
            }} className="bg-neutral-600 text-white hover:bg-red-700">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}