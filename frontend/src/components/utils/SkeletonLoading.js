import React from "react";

const Skeleton = () => {
  const array = [1, 2, 3, 4];

  return (
    <div className="grid  grid-cols-1 lg:grid-cols-4  md:grid-col-3 m-auto sm:grid-cols-2 xs:grid-col-2  gap-x-4 gap-y-4 ">

      {array.map((item) => (
        <div key = {item} className="rounded overflow-hidden flex flex-col justify-between shadow-lg">
          <p className="leading-relaxed w-full h-44 animate-pulse bg-gray-400"></p>
          <div className="p-4 text-sm flex justify-between items-center ">
            <p className="leading-relaxed mb-3 w-8  h-6 animate-pulse bg-gray-400 mr-4"></p>

            <p className="leading-relaxed mb-3 w-full  h-3 animate-pulse bg-gray-400"></p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Skeleton;
