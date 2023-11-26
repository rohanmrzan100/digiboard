import React from "react";

const Spinner = () => {
  return (
    <div>
      <div className="absolute right-1/2 bottom-1/2 z-10  transform translate-x-1/2 translate-y-1/2 ">
        <div className="border-t-transparent border-solid animate-spin   rounded-full border-blue-400 border-8 h-36 w-36"></div>
      </div>
      <div className="opacity-30 fixed inset-0 z-10 bg-black"></div>
    </div>
  );
};

export default Spinner;
