import React, { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import Filter from "../nav/Filter";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DevicesCard from "./DevicesCard";
import { getDevices } from "../../API/Device";
import { isloading } from "../../store/slice/utilsSlice";
import { useDispatch, useSelector } from "react-redux";
const Devices = () => {
    const loading = useSelector((state) => state.utils.isloading);
  const [devices, setDevices] = useState([]);
  const dispatch = useDispatch();
  isloading({ type: "true" });
  useEffect(() => {
    dispatch(isloading({ type: "false" }));
    getDevices().then((res) => {
      if (res.devices) {
        setDevices(res.devices);
        console.log(res.devices);
      }
    });
  }, []);
  return (
    <div className=" w-full px-4 py-2  ">
      <div className="sm:flex justify-center item-center ">
        <SearchBar />
        <div className="flex justify-start items-center my-4">
          <Filter />
          <div>
            <button
              onClick={() => {
                window.location.href = "/add_device";
              }}
              className=" w-32 hover:bg-gray-400 p-2.5 ml-2 text-sm border  font-medium text-black bg-gray-300 flex rounded-lg cursor-pointer flex items-center justify-between"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Add Device
            </button>
          </div>
          <div>
            <button
              onClick={() => {
                window.location.href = "/devices/add_group";
              }}
              className=" w-32 hover:bg-gray-400 p-2.5 ml-2 text-sm border  font-medium text-black bg-gray-300 flex rounded-lg cursor-pointer flex items-center justify-between"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Group Device
            </button>
          </div>
        </div>
      </div>
      <div className=" my-8">
        <h1 className="text-2xl font-semibold">Devices</h1>

        <div>
          {!loading && !devices.length > 0 && (
            <p className="text-black text-xl my-8">
              You have not added any devices.
            </p>
          )}

          {devices &&
            devices.map((device) => (
              <DevicesCard device={device} key={device._id} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Devices;
