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
    <div
      ref={downloadref}
      className="flex flex-col gap-4 justify-center h-full items-center text-white w-full"
    >
      <TicketComponent userData={userData} handleDownload={handleDownload} />
      <button className="cursor-pointer group relative flex gap-1.5 px-8 py-4 bg-black bg-opacity-80 text-[#f1f1f1] rounded-3xl hover:bg-opacity-70 transition font-semibold shadow-md absolute bottom-0" onClick={handleDownload}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          height="24px"
          width="24px"
        >
          <g stroke-width="0" id="SVGRepo_bgCarrier"></g>
          <g
            stroke-linejoin="round"
            stroke-linecap="round"
            id="SVGRepo_tracerCarrier"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <g id="Interface / Download">
              {" "}
              <path
                stroke-linejoin="round"
                stroke-linecap="round"
                stroke-width="2"
                stroke="#f1f1f1"
                d="M6 21H18M12 3V17M12 17L17 12M12 17L7 12"
                id="Vector"
              ></path>{" "}
            </g>{" "}
          </g>
        </svg>
        Download
        <div className="absolute opacity-0 -bottom-full rounded-md py-2 px-2 bg-black bg-opacity-70 left-1/2 -translate-x-1/2 group-hover:opacity-100 transition-opacity shadow-lg">
          Download
        </div>
      </button>
    </div>
  );
};

export default Tickets;
