import React from "react";
import QRCode from "react-qr-code";

const WorkshopTicket = ({ userData, handleDownload }) => {
  return (
    <div className="w-5/6 h-full lg:w-3/5 text-black uppercase flex flex-col justify-center items-center">
      <div className="w-full h-1/5 bg-white  rounded-xl">
        <div className="flex justify-between flex-col items-center px-5 py-2 h-full">
          <div className="flex justify-between items-center w-full h-full">
            <div>
              <div className="text-md">WORKSHOP</div>
              <div className="text-md">
                Ticket number: #{userData.ticketNumber}
              </div>
            </div>
            <QRCode value={String(userData.ticketNumber)} size={120} />
          </div>
        </div>
      </div>
      <div className="w-full h-auto bg-white border-y-black border-dashed border-2 rounded-xl p-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-md py-2 flex justify-end">
            <span className="font-bold">NAME :</span>
          </div>
          <div className="text-md py-2">{userData.firstName}</div>
          <div className="text-md py-2 flex justify-end">
            <span className="font-bold">EMAIL :</span>
          </div>
          <div className="text-md py-2">{userData.email}</div>
          <div className="text-md py-2 flex justify-end">
            <span className="font-bold">PHONE NUMBER :</span>
          </div>
          <div className="text-md py-2">{userData.phoneNumber}</div>
          <div className="text-md py-2 flex justify-end">
            <span className="font-bold">COLLEGE :</span>
          </div>
          <div className="text-md py-2">{userData.college}</div>
          <div className="text-md py-2 flex justify-end">
            <span className="font-bold">SEMESTER AND BRANCH :</span>
          </div>
          <div className="text-md py-2">
            {userData.semester} {userData.branch}
          </div>
          <div className="text-md py-2 flex justify-end">
            <span className="font-bold">FOOD PREFERENCE :</span>
          </div>
          <div className="text-md py-2">{userData.veg}</div>
          <div className="text-md py-2 flex justify-end">
            <span className="font-bold">VENUE :</span>
          </div>
          <div className="text-md py-2">MITS, KOCHI</div>
          <div className="text-md py-2 flex justify-end">
            <span className="font-bold">DATE AND TIME :</span>
          </div>
          <div className="text-md py-2 flex ">
            <div className="text-md">20th October 2021, 10:00 AM</div>
            <div className="text-md"></div>
          </div>
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
