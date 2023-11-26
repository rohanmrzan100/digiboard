import React from "react";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const SearchBar = () => {
  return (
    <form className="flex items-center w-full ">
      <label  className="sr-only text-black bg-gray-300">
        Search
      </label>
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-400" />
        </div>
        <input
          type="text"
          id="simple-search"
          className="border border-gray-300  text-sm rounded-lg text-black bg-gray-300 focus:ring-gray-900 focus:border-gray-500 block w-full pl-10 p-2.5 "
          placeholder="Search"
          required
        />
      </div>
      <button
        type="submit"
        className="p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        {" "}
        <FontAwesomeIcon icon={faMagnifyingGlass} />
        <span className="sr-only">Search</span>
      </button>
    </form>
  );
};

export default SearchBar;
