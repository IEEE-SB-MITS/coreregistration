"use client";
import React, { useEffect, useRef, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import db from "../../utils/config";
import NormalTicket from "./NormalTicket";
import WorkshopTicket from "./WorkshopTicket";
import html2canvas from "html2canvas";

const Tickets = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const downloadref = useRef();
  const [ticketNumber, setTicketNumber] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const ticketNum = urlParams.get("ticketNumber");
      const email = urlParams.get("email");

      if (ticketNum) {
        setTicketNumber(ticketNum);
        const ticketNumberInt = parseInt(ticketNum, 10);

        try {
          const q = query(
            collection(db, "CORE"),
            where("ticketNumber", "==", ticketNumberInt),
            where("email", "==", email)
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
    return <div className="w-full h-full flex items-center justify-center">
    <button
      class="text-zinc-500 hover:text-zinc-200 backdrop-blur-lg animate-pulse-er bg-gradient-to-tr from-transparent via-[rgba(121,121,121,0.16)] to-transparent rounded-md py-2 px-6 shadow hover:shadow-zinc-400 duration-700"
    >
      Ticket not found. Please check your ticket number and email.
    </button>
    </div>;
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

  let TicketComponent;
  if (ticketNumber.startsWith("10")) {
    TicketComponent = NormalTicket;
  } else if (ticketNumber.startsWith("20")) {
    TicketComponent = WorkshopTicket;
  } else {
    return <div>Error: Invalid ticket number.</div>;
  }

  return (
    <div
      ref={downloadref}
      className="flex flex-col relative gap-4 justify-center h-full items-center text-white w-full"
    >
      <TicketComponent userData={userData} handleDownload={handleDownload} />
  
<button
  class="cursor-pointer absolute bottom-10 right-10 bg-gray-800 px-3 py-2 rounded-md text-white tracking-wider shadow-xl animate-bounce hover:animate-none"
>
  <svg
    class="w-5 h-5"
    stroke="currentColor"
    stroke-width="2"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
      stroke-linejoin="round"
      stroke-linecap="round"
    ></path>
  </svg>
</button>

    </div>
  );
};

export default Tickets;
