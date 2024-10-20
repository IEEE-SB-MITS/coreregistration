import React from "react";
import QRCode from "react-qr-code";

const WorkshopTicket = ({ userData, handleDownload }) => {
  return (
    <div className="w-5/6 h-full lg:w-3/5 text-black uppercase flex flex-col justify-center items-center">
      <div className="w-full h-1/5 bg-white rounded-xl">
        <div className="flex justify-between flex-col items-center px-5 py-2 h-full">
          <div className="flex justify-between items-center w-full h-full">
            <div>
              <div className="text-md">WORKSHOP : {userData.Workshop}</div>
              <div className="text-md">Ticket number: #{userData.ticketNumber}</div>
            </div>
            <QRCode value={String(userData.ticketNumber)} size={120} />
          </div>
        </div>
      </div>
      <div className="w-full h-auto bg-white border-y-black border-dashed border-2 rounded-xl p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "NAME", value: userData.firstName },
            { label: "EMAIL", value: userData.email },
            { label: "PHONE NUMBER", value: userData.phoneNumber },
            { label: "COLLEGE", value: userData.college },
            { label: "SEMESTER AND BRANCH", value: `${userData.semester} ${userData.branch}` },
            { label: "FOOD PREFERENCE", value: userData.veg },
            { label: "VENUE", value: "MITS, KOCHI" },
            { label: "DATE AND TIME", value: "20th October 2021, 10:00 AM" },
          ].map(({ label, value }) => (
            <React.Fragment key={label}>
              <div className="text-md pb-1 flex justify-center md:justify-end">
                <span className="font-bold">{label} :</span>
              </div>
              <div className="text-md pb-2 md:py-3 text-center">{value}</div>
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className={`w-full h-1/5 rounded-t-xl ${userData.status === "pending" ? "bg-yellow-500" : userData.status === "confirmed" ? "bg-green-500" : "bg-black"}`}>
        <div className="flex justify-center items-center text-xl md:text-2xl px-5 py-2 w-full h-full">
          <div className="text-center py-2 rounded-lg text-white">
            <p className="font-bold">
              {userData.status === "pending" ? "VERIFICATION PENDING" : userData.status}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkshopTicket;
