import React from "react";
import { addDevice } from "../../API/Device";
import { isloading } from "../../store/slice/utilsSlice";
import { useDispatch } from "react-redux";
const Add = () => {
  const dispatch = useDispatch();
  const handleSubmit = (e) => {
    dispatch(isloading({ type: "true" }));
    e.preventDefault();

    const data = {
      name: e.target[0].value,
      uid: e.target[1].value.toLocaleLowerCase(),
    };
    addDevice(data).then((res) => {
      console.log(res);
      dispatch(isloading({ type: "false" }));
    });
    console.log(data);
  };
  return (
    <div>
      <div className="max-w-lg px-8  py-8 border-2 shadow-2xl  mx-auto   mt-4 rounded-xl">
        <p className="text-2xl my-4">
          {" "}
          Once you've installed Digi Board on your device, type in the given
          code to sync.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="my-8">
            <input
              placeholder="Device Name"
              className="shadow   rounded-md  w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
            />
          </div>
          <div className="my-8">
            <input
              placeholder="Code"
              className="shadow rounded-md w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="code"
              type="text"
            />
          </div>
          <div className="flex items-center justify-between">
            <a
              href="/devices"
              className=" text-red-500 underline font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </a>
            <button
              className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded active:scale-105 focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add;
