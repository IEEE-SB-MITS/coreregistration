"use client";
import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { app } from "../utils/firebase.config";

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

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <button onClick={handleLogout} className="mt-2 bg-red-500 text-white py-1 px-3 rounded">Log Out</button>
            <table className="table-auto w-full mt-4">
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>College Name</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {participants.map(participant => (
                        <tr key={participant.id}>
                            <td>{participant.firstName}</td>
                            <td>{participant.lastName}</td>
                            <td>{participant.email}</td>
                            <td>{participant.collegeName}</td>
                            <td>{participant.status}</td>
                            <td>
                                <button
                                    className="bg-green-500 text-white py-1 px-2 rounded mr-2"
                                    onClick={() => handleStatusChange(participant.id, "confirmed")}
                                >
                                    Confirm
                                </button>
                                <button
                                    className="bg-red-500 text-white py-1 px-2 rounded"
                                    onClick={() => handleStatusChange(participant.id, "rejected")}
                                >
                                    Reject
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPanel;