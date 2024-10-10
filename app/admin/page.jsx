"use client";
import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { app } from "../../utils/config";
import * as XLSX from 'xlsx';

const AdminPanel = () => {
    const [participants, setParticipants] = useState([]);
    const [user, setUser] = useState(null);
    const db = getFirestore(app);
    const auth = getAuth(app);

    // Check if the user is authenticated
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser && currentUser.email === "ieeesb@mgits.ac.in") {
                setUser(currentUser);
            } else {
                window.location.href = "/admin/login"; // Redirect to login if not authenticated
            }
        });

        return () => unsubscribe();
    }, [auth]);

    // Fetch participants from Firestore
    useEffect(() => {
        const fetchParticipants = async () => {
            const querySnapshot = await getDocs(collection(db, "CORE"));
            const data = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setParticipants(data);
        };
        fetchParticipants();
    }, [db]);

    // Handle status change
    const handleStatusChange = async (id, newStatus) => {
        const participantRef = doc(db, "CORE", id);
        await updateDoc(participantRef, { status: newStatus });
        setParticipants(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    };

    // Log out
    const handleLogout = () => {
        signOut(auth);
        window.location.href = "/login";
    };

    // Export to Excel
    const handleExport = () => {
        const worksheet = XLSX.utils.json_to_sheet(participants);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Participants");
        XLSX.writeFile(workbook, "participants.xlsx");
    };

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
            <button onClick={handleLogout} className="mb-4 bg-red-500 text-white py-1 px-3 rounded">Log Out</button>
            <button onClick={handleExport} className="mb-4 bg-blue-500 text-white py-1 px-3 rounded ml-2">Export to Excel</button>
            <div className="overflow-x-auto">
                               <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">College Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Screenshot</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {participants.map((participant, index) => (
                      <tr key={participant.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{participant.ticketNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{participant.firstName} {participant.lastName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{participant.phoneNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{participant.college}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{participant.transactionId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {participant.paymentScreenshotUrl && (
                            <img src={participant.paymentScreenshotUrl} alt="Payment Screenshot" className="h-16 w-16 object-cover" />
                          )}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${participant.status === "pending" ? "bg-yellow-500 text-white" : participant.status === "confirmed" ? "bg-green-500 text-white" : "bg-black text-white"}`}>{participant.status}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            className="bg-green-500 text-white py-1 px-2 rounded mr-2 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                            onClick={() => handleStatusChange(participant.id, "confirmed")}
                          >
                            Confirm
                          </button>
                          <button
                            className="bg-red-500 text-white py-1 px-2 rounded mr-2 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                            onClick={() => handleStatusChange(participant.id, "rejected")}
                          >
                            Reject
                          </button>
                          <button
                            className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            onClick={() => handleStatusChange(participant.id, "pending")}
                          >
                            Pending
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPanel;
