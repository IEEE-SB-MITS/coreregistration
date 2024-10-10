"use client";
import React, { useEffect, useRef, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import db from "../../utils/config";
import Image from "next/image";
import html2canvas from "html2canvas";
import mcr from "../../public/mobile-cr.png";

const Tickets = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const downloadref = useRef();

  useEffect(() => {
    const fetchUserData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const ticketNumber = urlParams.get("ticketNumber");

      if (ticketNumber) {
        const ticketNumberInt = parseInt(ticketNumber, 10);

        try {
          const q = query(
            collection(db, "CORE"),
            where("ticketNumber", "==", ticketNumberInt)
          );
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const data = querySnapshot.docs[0].data();
            setUserData(data);
          } else {
            console.error("Ticket not found.");
          }
        } catch (error) {
          console.error("Error fetching ticket: ", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false); 
      }
    };

    fetchUserData();
  }, []); 

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>Ticket not found.</div>;
  }
  const handleDownload = () => {
    if (downloadref.current) {
      html2canvas(downloadref.current, {
        backgroundColor: "#000000", 
        ignoreElements: (element) => {
          const style = window.getComputedStyle(element);
          return style.backgroundImage !== "none";
        },
        onclone: (document) => {
          const elements = document.getElementsByTagName("*");
          for (let i = 0; i < elements.length; i++) {
            const el = elements[i];
            const style = window.getComputedStyle(el);
            if (style.color.startsWith("oklch(")) {
              el.style.color = "#FFFFFF"; 
            }
            if (style.backgroundColor.startsWith("oklch(")) {
              el.style.backgroundColor = "#000000"; 
            }
          }
        },
      }).then((canvas) => {
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = "ticket.png";
        link.click();
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>Ticket not found.</div>;
  }

  return (
    <div
      className="flex flex-col gap-4 justify-center h-full  items-center text-white w-full "
      ref={downloadref}
    >
      <div className="text-xl md:text-3xl flex flex-col justify-center items-center py-1 border-gray-500 text-[#D9D9D9] border-b-[0.5px]">
        <p className="text-md py-2">&#40;Ticket number: {userData.ticketNumber}&#41;</p>
      </div>

      <div className="bg-white w-5/6 lg:w-2/3 text-black uppercase">
        <div className="bg-[#D9D9D9] flex justify-between py-4 px-2 lg:p-5">
          <div className="flex flex-col gap-1 w-1/2">
            <div className="font-bold text-xs md:text-sm">NAME</div>
            <div className="font-semibold text-xs md:text-base">
              {userData.firstName} {userData.lastName}
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 w-1/2">
            <div className="font-bold text-xs md:text-sm">
              SEMESTER AND BRANCH
            </div>
            <div className="font-semibold text-xs md:text-base">
            {userData.semester} {userData.branch}
            </div>
          </div>
        </div>

        <div className="border-black border-b-[1px] flex justify-between py-4 px-2 lg:p-5">
          <div className="flex flex-col gap-1 w-1/2">
            <div className="font-bold text-xs md:text-sm">FOOD PREFERENCE</div>
            <div className="font-semibold text-xs md:text-base">{userData.veg}</div>
          </div>

          <div className="flex flex-col items-end gap-1 w-1/2">
            <div className="font-bold text-xs md:text-sm">PHONE NUMBER</div>
            <div className="font-semibold text-xs md:text-base">
              {userData.phoneNumber}
            </div>
          </div>
        </div>

        <div className="flex justify-between py-4 px-2 lg:p-5">
          <div className="flex flex-col gap-1 w-1/2">
            <div className="font-bold text-xs md:text-sm">COLLEGE NAME</div>
            <div className="font-semibold text-xs md:text-base">
              {userData.college}
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 w-1/2">
            <div className="font-bold text-xs md:text-sm">
              IEEE MEMBERSHIP ID
            </div>
            <div className="font-semibold text-xs md:text-base">
              {userData.ieeeMembershipId ? userData.ieeeMembershipId : "-"}
            </div>
          </div>
        </div>

        <div className="flex py-4 px-2 lg:p-5 items-center bg-black text-white">
          <div className="w-1/2 flex justify-center font-bold text-xs md:text-base">
            VENUE
          </div>

          <div className="flex flex-col w-1/2">
            <div className="font-bold text-xs md:text-base">
              Muthoot Institute of
            </div>
            <div className="font-bold text-xs md:text-base">
              Technology And Science
            </div>
          </div>
        </div>

        <div className="flex py-4 px-2 lg:p-5 items-center">
          <div className="w-1/2 flex justify-end font-bold pr-6 text-xs md:text-base">
            DATE AND TIME
          </div>

          <div className="flex flex-col  w-1/2">
            <div className="font-bold text-xs md:text-base">
              31st October - 01st November 2024
            </div>
            <div className="font-bold text-xs md:text-base">
              9 A.M. to 6 P.M.
            </div>
          </div>
        </div>
        <div
          className={`flex py-4 px-2 lg:p-5 items-center ${
            userData.status === "pending"
              ? "bg-yellow-500 text-white"
              : userData.status === "confirmed"
              ? "bg-green-500 text-white"
              : "bg-black text-white"
          }`}
        >
          <div className="flex justify-center uppercase text-center w-full font-bold text-xs md:text-base">
            {userData.status}
          </div>
        </div>
      </div>

      <div>
        <div
          className="btn btn-sm  h-9 w-44 flex justify-center items-center rounded-full  text-white border border-[#505459]"
          style={{
            background: `linear-gradient(90deg, rgba(136, 158, 175, 0.8) 0%, rgba(27, 30, 32, 0.744) 98.32%)`,
          }}
          onClick={handleDownload}
        >
          DOWNLOAD
        </div>
      </div>
    </div>
  );
};


export default Tickets;
