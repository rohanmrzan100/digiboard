import { useState } from "react";
import {

  faChevronUp,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const Index = () => {
  const [isList, setIsList] = useState(false);
  return (
    <div>
      <div
        onClick={() => setIsList(!isList)}
        className=" w-24 hover:bg-gray-400 p-2.5 ml-2 text-sm border  font-medium text-black bg-gray-300 flex rounded-lg cursor-pointer flex items-center justify-between"
      >
        Filter
        <div className="px-2">
          {!isList ? (
            <div>
              <FontAwesomeIcon icon={faChevronDown} />
            </div>
          ) : (
            <div>
              <FontAwesomeIcon icon={faChevronUp} />
            </div>
          )}
        </div>
      </div>
      {isList && (
        <div className=" absolute  m-1 p-1 bg-white shadow rounded">
          <div className="flex flex-col">
            <button
              className="cursor-pointer text-xs font-semibold   leading-3 tracking-normal py-3 hover:bg-gray-100 px-3 font-normal"
              // onClick={() => navigate("/auth/login")}
            >
              Most Recently Seen
            </button>
            <button
              className="cursor-pointer text-xs font-semibold   leading-3 tracking-normal py-3 hover:bg-gray-100 px-3 font-normal"
              // onClick={() => navigate("/auth/login")}
            >
              Most Recently Seen
            </button>
            <button
              className="cursor-pointer text-xs font-semibold   leading-3 tracking-normal py-3 hover:bg-gray-100 px-3 font-normal"
              // onClick={() => navigate("/auth/login")}
            >
              Most Recently Seen
            </button>
            <button
              className="cursor-pointer text-xs font-semibold   leading-3 tracking-normal py-3 hover:bg-gray-100 px-3 font-normal"
              // onClick={() => navigate("/auth/login")}
            >
              Most Recently Seen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Index;
