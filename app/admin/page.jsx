"use client";
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { app } from "../../utils/config";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  LogOut,
  FileSpreadsheet,
  Check,
  X,
  Clock,
  Maximize2,
  Trash,
} from "lucide-react";

export default function AdminPanel() {
  const [participants, setParticipants] = useState([]);
  const [bulkRegistrations, setBulkRegistrations] = useState([])
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [participantToDelete, setParticipantToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const db = getFirestore(app);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.email === "ieeesb@mgits.ac.in") {
        setUser(currentUser);
      } else {
        window.location.href = "/admin/login";
      }
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const participantsSnapshot = await getDocs(collection(db, 'CORE'))
      const participantsData = participantsSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        transactionId: doc.data().transactionId.toString(),
        ticketNumber: doc.data().ticketNumber.toString(),
      }))

      const bulkRegistrationsSnapshot = await getDocs(collection(db, 'bulkregistrations'))
      const bulkRegistrationsData = bulkRegistrationsSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))

      setParticipants(participantsData.sort((a, b) => a.ticketNumber.localeCompare(b.ticketNumber)))
      setBulkRegistrations(bulkRegistrationsData)
      setLoading(false)
    }

    fetchData()
  }, [db])

  const handleStatusChange = async (id, newStatus) => {
    const participantRef = doc(db, "CORE", id);
    await updateDoc(participantRef, { status: newStatus });
    setParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  };

  const handleStatusBChange = async (id, newStatus) => {
    const participantRef = doc(db, "bulkregistrations", id);
    await updateDoc(participantRef, { status: newStatus });
    setParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  };

  const handleDelete = async () => {
    setDeleting(true);
    if (participantToDelete) {
      const participantRef = doc(db, "CORE", participantToDelete.id);
      await deleteDoc(participantRef);
      setParticipants((prev) =>
        prev.filter((p) => p.id !== participantToDelete.id)
      );
      setDeleteDialogOpen(false);
      setParticipantToDelete(null);
    }
    setDeleting(false);
  };

  const handleBDelete = async () => {
    setDeleting(true);
    if (participantToDelete) {
      const participantRef = doc(db, "bulkregistrations", participantToDelete.id);
      await deleteDoc(participantRef);
      setParticipants((prev) =>
        prev.filter((p) => p.id !== participantToDelete.id)
      );
      setDeleteDialogOpen(false);
      setParticipantToDelete(null);
    }
    setDeleting(false);
  };

  const handleLogout = () => {
    signOut(auth);
    window.location.href = "/login";
  };

  const handleExport = () => {
    const exportData = participants.map((participant) => ({
      ticketNumber: participant.ticketNumber,
      firstName: participant.firstName,
      lastName: participant.lastName,
      phone: participant.phoneNumber,
      email: participant.email,
      veg: participant.veg,
      branch: participant.branch,
      sem: participant.semester,
      college: participant.college,
      ieeeMember: participant.ieeeMember,
      rasMember: participant.rasMember,
      referralCode: participant.referralCode,
      transactionId: participant.transactionId.toString().padStart(12, "0"),
      paymentUrl: participant.paymentScreenshotUrl,
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Participants");
    XLSX.writeFile(workbook, "participants.xlsx");
  };

  const handleBulkExport = () => {
    // Structure the data for export
    const exportData = bulkRegistrations.flatMap((registration) => [
      {
        ticketNumber: registration.teamLead.ticketNumber || '',
        firstName: registration.teamLead.firstName,
        lastName: registration.teamLead.lastName,
        email: registration.teamLead.email,
        phone: registration.teamLead.phone,
        branch: registration.teamLead.branch,
        college: registration.teamLead.college,
        semester: registration.teamLead.semester,
        role: "Team Lead",
        transactionId: registration.teamLead.transactionId.toString().padStart(12, "0"),
        paymentUrl: registration.teamLead.paymentScreenshot,
      },
      ...registration.teamMembers.map((member) => ({
        ticketNumber: member.ticketNumber || '',
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email || '',
        phone: member.phone || '',
        branch: member.branch,
        college: member.college,
        semester: member.semester,
        role: "Team Member",
        transactionId: '',
        paymentUrl: '',
      }))
    ]);
  
    // Convert data to worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bulk Registration");
  
    // Export workbook as Excel file
    XLSX.writeFile(workbook, "bulk_registration.xlsx");
  };


  const earlyBird = participants.filter(
    (p) => p.ticketNumber.startsWith("10") && !p.ticketNumber.startsWith("1002")
  );
  const earlyBirdCount = earlyBird.length;

  const conclaveParticipants = participants.filter((p) =>
    p.ticketNumber.startsWith("1002")
  );
  const conclaveParticipantsCount = conclaveParticipants.length;

  const bootcampParticipants = participants.filter((p) =>
    p.ticketNumber.startsWith("20")
  );
  const bootcampParticipantsCount = bootcampParticipants.length;

  const totalParticipants = earlyBirdCount + conclaveParticipantsCount + bootcampParticipantsCount;

  if (!user || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-md p-4 md:p-0 bg-transparent md:bg-white shadow-none md:shadow-lg border-none md:border">
          <CardContent className="flex flex-col items-center justify-center h-60">
            <div className="w-16 h-16 relative">
              <div className="w-16 h-16 border-4 border-t-primary border-r-primary border-b-primary border-l-primary border-solid rounded-full animate-spin"></div>
              <div className="w-16 h-16 border-4 border-t-transparent border-r-transparent border-b-transparent border-l-primary border-solid rounded-full animate-ping absolute top-0 left-0"></div>
            </div>
            <p className="text-lg mt-4 text-primary animate-pulse">
              Loading...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
          <CardTitle className="text-2xl font-bold">Admin Panel</CardTitle>
          <h2 className="text-lg font-semibold">Total Participants :- {totalParticipants}</h2>
          </div>
          <div className="space-x-2 space-y-2 flex flex-col md:flex-row">
            <Button onClick={handleExport} variant="outline">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export to Excel
            </Button>
            <Button onClick={handleBulkExport} variant="outline">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export Bulk
            </Button>
            <Button onClick={handleLogout} variant="destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">
            EARLY BIRD Participants
          </h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S.No</TableHead>
                  <TableHead>Ticket Number</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>College Name</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Payment Screenshot</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {earlyBird.map((participant, index) => (
                  <TableRow key={participant.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{participant.ticketNumber}</TableCell>
                    <TableCell className="font-medium">
                      {participant.firstName} {participant.lastName}
                    </TableCell>
                    <TableCell>{participant.phoneNumber}</TableCell>
                    <TableCell>{participant.college}</TableCell>
                    <TableCell>{participant.transactionId}</TableCell>
                    <TableCell>
                      {participant.paymentScreenshotUrl && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" className="p-0">
                              <img
                                src={participant.paymentScreenshotUrl}
                                alt="Payment Screenshot"
                                className="h-16 w-16 object-cover rounded cursor-pointer"
                              />
                              <Maximize2 className="h-4 w-4 absolute bottom-1 right-1 text-white bg-black bg-opacity-50 rounded-full p-1" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="w-96 max-w-full mx-auto my-8">
                            <img
                              src={participant.paymentScreenshotUrl}
                              alt="Payment Screenshot"
                              className="w-full h-auto"
                            />
                          </DialogContent>
                        </Dialog>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          participant.status === "pending"
                            ? "warning"
                            : participant.status === "confirmed"
                            ? "success"
                            : "destructive"
                        }
                        className={
                          participant.status === "pending"
                            ? "bg-yellow-500 text-black"
                            : participant.status === "confirmed"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }
                      >
                        {participant.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleStatusChange(participant.id, "confirmed")
                          }
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleStatusChange(participant.id, "pending")
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setParticipantToDelete(participant);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-4">
            CONCLAVE Participants
          </h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S.No</TableHead>
                  <TableHead>Ticket Number</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>College Name</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Payment Screenshot</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {conclaveParticipants.map((participant, index) => (
                  <TableRow key={participant.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{participant.ticketNumber}</TableCell>
                    <TableCell className="font-medium">
                      {participant.firstName} {participant.lastName}
                    </TableCell>
                    <TableCell>{participant.phoneNumber}</TableCell>
                    <TableCell>{participant.college}</TableCell>
                    <TableCell>{participant.transactionId}</TableCell>
                    <TableCell>
                      {participant.paymentScreenshotUrl && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" className="p-0">
                              <img
                                src={participant.paymentScreenshotUrl}
                                alt="Payment Screenshot"
                                className="h-16 w-16 object-cover rounded cursor-pointer"
                              />
                              <Maximize2 className="h-4 w-4 absolute bottom-1 right-1 text-white bg-black bg-opacity-50 rounded-full p-1" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="w-96 max-w-full mx-auto my-8">
                            <img
                              src={participant.paymentScreenshotUrl}
                              alt="Payment Screenshot"
                              className="w-full h-auto"
                            />
                          </DialogContent>
                        </Dialog>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          participant.status === "pending"
                            ? "warning"
                            : participant.status === "confirmed"
                            ? "success"
                            : "destructive"
                        }
                        className={
                          participant.status === "pending"
                            ? "bg-yellow-500 text-black"
                            : participant.status === "confirmed"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }
                      >
                        {participant.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleStatusChange(participant.id, "confirmed")
                          }
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleStatusChange(participant.id, "pending")
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setParticipantToDelete(participant);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-4">
            BOOTCAMP Participants
          </h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S.No</TableHead>
                  <TableHead>Ticket Number</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>College Name</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Payment Screenshot</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bootcampParticipants.map((participant, index) => (
                  <TableRow key={participant.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{participant.ticketNumber}</TableCell>
                    <TableCell className="font-medium">
                      {participant.firstName} {participant.lastName}
                    </TableCell>
                    <TableCell>{participant.phoneNumber}</TableCell>
                    <TableCell>{participant.college}</TableCell>
                    <TableCell>{participant.transactionId}</TableCell>
                    <TableCell>
                      {participant.paymentScreenshotUrl && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" className="p-0">
                              <img
                                src={participant.paymentScreenshotUrl}
                                alt="Payment Screenshot"
                                className="h-16 w-16 object-cover rounded cursor-pointer"
                              />
                              <Maximize2 className="h-4 w-4 absolute bottom-1 right-1 text-white bg-black bg-opacity-50 rounded-full p-1" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="w-96 max-w-full mx-auto my-8">
                            <img
                              src={participant.paymentScreenshotUrl}
                              alt="Payment Screenshot"
                              className="w-full h-auto"
                            />
                          </DialogContent>
                        </Dialog>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          participant.status === "pending"
                            ? "warning"
                            : participant.status === "confirmed"
                            ? "success"
                            : "destructive"
                        }
                        className={
                          participant.status === "pending"
                            ? "bg-yellow-500 text-black"
                            : participant.status === "confirmed"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }
                      >
                        {participant.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleStatusChange(participant.id, "confirmed")
                          }
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleStatusChange(participant.id, "pending")
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setParticipantToDelete(participant);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-4">
            Bulk Registrations
            <span className="text-sm text-black/60"> (RELOAD TO SEE CHANGES)</span>
          </h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S.No</TableHead>
                  <TableHead>Team Lead</TableHead>
                  <TableHead>Team Members</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Payment Screenshot</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bulkRegistrations.map((registration, index) => (
                  <TableRow key={registration.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      {registration.teamLead.firstName} {registration.teamLead.lastName}
                    </TableCell>
                    <TableCell>{registration.teamMembers.length+1}</TableCell>
                    <TableCell>{registration.teamLead.phone}</TableCell>
                    <TableCell>{registration.totalAmount}</TableCell>
                    <TableCell>{registration.teamLead.transactionId}</TableCell>
                    <TableCell>
                      {registration.teamLead.paymentScreenshot && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" className="p-0">
                              <img
                                src={registration.teamLead.paymentScreenshot}
                                alt="Payment Screenshot"
                                className="h-16 w-16 object-cover rounded cursor-pointer"
                              />
                              <Maximize2 className="h-4 w-4 absolute bottom-1 right-1 text-white bg-black bg-opacity-50 rounded-full p-1" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="w-96 max-w-full mx-auto my-8">
                            <img
                              src={registration.teamLead.paymentScreenshot}
                              alt="Payment Screenshot"
                              className="w-full h-auto"
                            />
                          </DialogContent>
                        </Dialog>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          registration.status === "pending"
                            ? "warning"
                            : registration.status === "confirmed"
                            ? "success"
                            : "destructive"
                        }
                        className={
                          registration.status === "pending"
                            ? "bg-yellow-500 text-black"
                            : registration.status === "confirmed"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }
                      >
                        {registration.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleStatusBChange(registration.id, "confirmed")
                          }
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleStatusBChange(registration.id, "pending")
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setParticipantToDelete(registration);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      

      <Dialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
          <p>
            Are you sure you want to delete {participantToDelete?.firstName}{" "}
            {participantToDelete?.lastName}?
          </p>
          <div className="flex space-x-4 mt-4">
            <Button
              onClick={handleBDelete}
              variant="destructive"
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
