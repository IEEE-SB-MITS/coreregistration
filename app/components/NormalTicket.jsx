import React from "react";

const NormalTicket = ({ userData, handleDownload }) => {
  return (
    <div className="bg-white w-5/6 lg:w-2/3 text-black uppercase">
      <div className="text-xl md:text-3xl flex flex-col justify-center items-center py-1 border-gray-500 text-[#D9D9D9] border-b-[0.5px]">
        <p className="text-md py-2">Ticket number: {userData.ticketNumber}</p>
      </div>

      <div className="bg-[#D9D9D9] flex justify-between py-4 px-2 lg:p-5">
        <div className="flex flex-col gap-1 w-1/2">
          <div className="font-bold text-xs md:text-sm">NAME</div>
          <div className="font-semibold text-xs md:text-base">
            {userData.firstName} {userData.lastName}
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 w-1/2">
          <div className="font-bold text-xs md:text-sm">SEMESTER AND BRANCH</div>
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
          <div className="font-bold text-xs md:text-sm">IEEE MEMBERSHIP ID</div>
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

        <div className="flex flex-col w-1/2">
          <div className="font-bold text-xs md:text-base">
            30th October - 31st October 2024
          </div>
          <div className="font-bold text-xs md:text-base">
            9 A.M. to 6 P.M.
          </div>
        </div>
      </div>

      <div className={`flex py-4 px-2 lg:p-5 items-center ${userData.status === "pending" ? "bg-yellow-500 text-white" : userData.status === "confirmed" ? "bg-green-500 text-white" : "bg-black text-white"}`}>
        <div className="flex justify-center uppercase text-center w-full font-bold text-xs md:text-base">
          {userData.status}
        </div>
      </div>
    </div>
  );
};

export default NormalTicket;
