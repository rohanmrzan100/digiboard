import React, { useEffect, useState } from "react";
import { getDevices } from "../../../API/Device";
import { addArray, removeArray } from "../../../store/slice/arraySlice";
import { useDispatch, useSelector } from "react-redux";

const AddGroup = () => {
  const [devices, setDevices] = useState();
  const dispatch = useDispatch();
  const array = useSelector((state) => state.array);
  useEffect(() => {
    getDevices()
      .then((res) => {
        console.log(res);
        setDevices(res.devices);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e.target.name.value);
    console.log(array);
  };
  const handleChange = (event, device) => {
    const id = device._id;

    if (event.target.checked) {
      dispatch(addArray(id));
    } else {
      dispatch(removeArray({ id, array }));
    }
  };
  return (
    <div className="w-full mt-8 ">
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-8 flex item-center justify-between ">
          <div className="mb-2 w-5/12">
            <label className="block text-sm font-semibold text-gray-800">
              Enter Name of Group
            </label>
            <input
              name="name"
              type="text"
              className="block w-full  px-4 py-2 mt-2 text-black bg-white border border-black rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>
          <button
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold   px-4 rounded active:scale-105 focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Create Playlist
          </button>
        </div>
        <h1 className="text-2xl mb-8 font-semibold">Available Devices </h1>
        <div className="grid grid-cols-1 lg:grid-cols-6  md:grid-col-4 m-auto sm:grid-cols-3 xs:grid-col-2  gap-x-4 gap-y-4 ">
          {devices &&
            devices.map((device) => (
              <div
                key={device._id}
                className="border rounded-md   bg-gray-300 p-4 flex justify-start items-center"
              >
                <input
                  onChange={(e) => handleChange(e, device)}
                  id="default-checkbox"
                  type="checkbox"
                  value=""
                  className="w-4 h-4 mr-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                ></input>
                <div className="">
                  <h1 className=" text-xl">{device.name}</h1>
                  <p>{device.uid}</p>
                  <h3>
                    Now Playing :<br /> <span>{device.c_playlist}</span>
                  </h3>
                </div>
              </div>
            ))}
        </div>
      </form>
    </div>
  );
};

export default AddGroup;
