// src/components/TopCard.tsx
import React from "react";

const AdminTopbar: React.FC = () => {
  return (
    <div className="w-full flex justify-between items-center px-4 py-0 bg-[#D5E1E7] rounded-t-lg ml-16">
      {/* Left Section: Title */}
      <div>
        <p className="text-lg text-gray-500 font-poppins pl-8">
          <span className="font-semibold text-gray-600">Admin</span> /{" "}
          <span className="font-bold text-black">Dashboard</span>
        </p>
      </div>
    </div>
  );
};

export default AdminTopbar;
