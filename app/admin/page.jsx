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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [participantToDelete, setParticipantToDelete] = useState(null);
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
    const fetchParticipants = async () => {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "CORE"));
        const data = querySnapshot.docs.map((doc) => {
          const participantData = doc.data();
          return {
            ...participantData,
            id: doc.id,
            transactionId: participantData.transactionId.toString(), // Ensure transactionId is a string
            ticketNumber: participantData.ticketNumber.toString(), // Ensure ticketNumber is a string
            // Add more fields here if necessary
          };
        });
        setParticipants(data);
        setLoading(false);
      };
      
    fetchParticipants();
  }, [db]);

  const handleStatusChange = async (id, newStatus) => {
    const participantRef = doc(db, "CORE", id);
    await updateDoc(participantRef, { status: newStatus });
    setParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  };

  const handleDelete = async () => {
    if (participantToDelete) {
      const participantRef = doc(db, "CORE", participantToDelete.id);
      await deleteDoc(participantRef);
      setParticipants((prev) =>
        prev.filter((p) => p.id !== participantToDelete.id)
      );
      setDeleteDialogOpen(false);
      setParticipantToDelete(null);
    }
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
      transactionId: participant.transactionId.toString().padStart(12, "0"), // Pad with zeros
      paymentUrl: participant.paymentScreenshotUrl,
    }));
    console.log(exportData);
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Participants");
    XLSX.writeFile(workbook, "participants.xlsx");
  };

  if (!user || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-md">
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
          <CardTitle className="text-2xl font-bold">Admin Panel</CardTitle>
          <div className="space-x-2">
            <Button onClick={handleExport} variant="outline">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export to Excel
            </Button>
            <Button onClick={handleLogout} variant="destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </div>
        </CardHeader>
        <CardContent>
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
                {participants.map((participant, index) => (
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
                            handleStatusChange(participant.id, "rejected")
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleStatusChange(participant.id, "pending")
                          }
                        >
                          <Clock className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
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
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <h2 className="text-lg font-semibold">Confirm Deletion</h2>
          {participantToDelete && (
            <p>
              Are you sure you want to delete {participantToDelete.firstName}?
            </p>
          )}
          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="ml-2"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
