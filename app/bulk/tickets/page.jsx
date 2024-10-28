"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs } from 'firebase/firestore';
import db from '../../../utils/config';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Ticket, User, Mail, Building, GraduationCap, Calendar, Search, Phone } from 'lucide-react';

export default function BulkTickets() {
  const [teamLeadFirstName, setTeamLeadFirstName] = useState('');
  const [teamLeadEmail, setTeamLeadEmail] = useState('');
  const [teamLeadPhone, setTeamLeadPhone] = useState('');
  const [teamData, setTeamData] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();

  const fetchTeamData = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const bulkRegistrationsRef = collection(db, "bulkregistrations");
      const q = query(
        bulkRegistrationsRef,
        where("teamLead.firstName", "==", teamLeadFirstName),
        where("teamLead.email", "==", teamLeadEmail),
        where("teamLead.phone", "==", teamLeadPhone)
      );

      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const docData = querySnapshot.docs[0].data();
        setTeamData(docData);
      } else {
        setError('No matching team found. Please check the details.');
      }
    } catch (error) {
      console.error("Error fetching team data:", error);
      setError('An error occurred while fetching the team data.');
    }
  };

  const TicketCard = ({ member, isLead = false, status }) => (
    <Card className="w-full max-w-sm mx-auto mb-4 bg-neutral-800 text-white border-neutral-700 hover:border-red-800 transition-all duration-300 transform hover:-translate-y-1">
      <CardHeader className="bg-gradient-to-r from-neutral-700 to-neutral-800 border-b border-red-900">
        <CardTitle className="flex items-center justify-between">
          <span>{isLead ? 'Team Lead' : 'Team Member'}</span>
          <Ticket className="h-6 w-6 text-red-400" />
        </CardTitle>
        <CardDescription className="text-neutral-400">Ticket #{member.ticketNumber}</CardDescription>
        <CardDescription className="text-neutral-400">{status}</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-red-400" />
            <span>{`${member.firstName} ${member.lastName}`}</span>
          </div>
          {isLead && (
            <>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-red-400" />
                <span>{member.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-red-400" />
                <span>{member.phone}</span>
              </div>
            </>
          )}
          <div className="flex items-center space-x-2">
            <Building className="h-4 w-4 text-red-400" />
            <span>{member.branch}</span>
          </div>
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-4 w-4 text-red-400" />
            <span>{member.college}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-red-400" />
            <span>{member.semester}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center">
      <div className="w-full max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Bulk Registration Tickets</h1>
        {}
        {!teamData ? (
          <Card className="bg-neutral-800 border-neutral-700 p-6 mb-8">
            <form onSubmit={fetchTeamData} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="teamLeadFirstName" className="text-white">Team Lead First Name</Label>
                  <Input
                    id="teamLeadFirstName"
                    value={teamLeadFirstName}
                    onChange={(e) => setTeamLeadFirstName(e.target.value)}
                    placeholder="John / john"
                    required
                    className="bg-neutral-700 text-white border-neutral-600 focus:border-red-500"
                  />
                </div>
                <div>
                  <Label htmlFor="teamLeadEmail" className="text-white">Team Lead Email</Label>
                  <Input
                    id="teamLeadEmail"
                    type="email"
                    value={teamLeadEmail}
                    onChange={(e) => setTeamLeadEmail(e.target.value)}
                    placeholder="johndoe@example.com"
                    required
                    className="bg-neutral-700 text-white border-neutral-600 focus:border-red-500"
                  />
                </div>
                <div>
                  <Label htmlFor="teamLeadPhone" className="text-white">Team Lead Phone</Label>
                  <Input
                    id="teamLeadPhone"
                    type="tel"
                    value={teamLeadPhone}
                    onChange={(e) => setTeamLeadPhone(e.target.value)}
                    placeholder="1234567890"
                    required
                    className="bg-neutral-700 text-white border-neutral-600 focus:border-red-500"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-red-800 hover:bg-red-700 text-white flex items-center justify-center">
                <Search className="mr-2 h-4 w-4" />
                Fetch Tickets
              </Button>
            </form>
            {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
          </Card>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <TicketCard member={teamData.teamLead} isLead={true} status={teamData.status} />
              {teamData.teamMembers.map((member, index) => (
                <TicketCard key={index} member={member} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button onClick={() => router.push('/bulk')} className="bg-red-800 hover:bg-red-700 text-white">
                Back to Registration
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}