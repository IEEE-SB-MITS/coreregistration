"use client";
import React, { useEffect, useRef, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import db from "../../utils/config";
import NormalTicket from './NormalTicket'; 
import WorkshopTicket from './WorkshopTicket'; 
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

  let TicketComponent;
  if (ticketNumber.startsWith("10")) {
    TicketComponent = NormalTicket;
  } else if (ticketNumber.startsWith("20")) {
    TicketComponent = WorkshopTicket;
  } else {
    return <div>Error: Invalid ticket number.</div>;
  }

  return (
    <div ref={downloadref} className="flex flex-col gap-4 justify-center h-full items-center text-white w-full">
      <TicketComponent userData={userData} handleDownload={handleDownload} />
      <div>
        <div
          className="btn btn-sm h-9 w-44 flex justify-center items-center rounded-full absolute bottom-10 right-0 text-white border border-[#505459]"
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
