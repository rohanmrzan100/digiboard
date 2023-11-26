import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { register } from "../../API/User";
import { useDispatch, useSelector } from "react-redux";
import { isloading, setError, unsetError } from "../../store/slice/utilsSlice";
import { errorToast, successToast } from "../utils/Toast";
import Spinner from "../utils/Spinner";

const Signup = () => {
   const loading = useSelector((state) => state.utils.isloading);
  const errorMsg = useSelector((state) => state.utils.errorMsg);
  const error = useSelector((state) => state.utils.error);
  const [show, setShow] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      name: e.target[0].value,
      email: e.target[1].value,
      password: e.target[2].value,
    };
    dispatch(isloading({ type: "true" }));

    register(data)
      .then((res) => {
        console.log(res);
        successToast("Registration Successful");

        setInterval(() => {
          window.location.href = "/signin";
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
        dispatch(isloading({ type: "false" }));
        if (err.response) {
          dispatch(setError(err.response.data.msg));
          errorToast(err.response.data.msg);
        } else {
          errorToast("Registrationnn Failed");
        }
      });
  };

  return (
    <>
      {loading && <Spinner />}
      <div className="w-10/12 p-6 m-auto bg-white border border-gray-600 rounded-md shadow-md md:max-w-md lg:max-w-lg absolute right-1/2 bottom-1/2  transform translate-x-1/2 translate-y-1/2">
        <h1 className="text-3xl font-semibold text-center text-indigo-700 ">
          Sign Up
        </h1>

        {error && (
          <p className="my-6 border border-red-600 p-2  text-red-700 font-semibold">
            {errorMsg}
          </p>
        )}
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-2">
            <label className="block text-sm font-semibold text-gray-800">
              Company Name
            </label>
            <input
              name="name"
              type="text"
              className="block w-full px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-semibold text-gray-800">
              Email
            </label>
            <input
              onChange={() => dispatch(unsetError())}
              name="email"
              type="email"
              className="block w-full px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-semibold text-gray-800">
              Password
            </label>
            <div className="relative flex items-center justify-center">
              <input
                name="password"
                type={show ? "text" : "password"}
                className="block w-full px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
              />
              <div
                onClick={() => setShow(!show)}
                className="absolute right-0 mt-2 mr-3 cursor-pointer"
              >
                {show ? (
                  <FontAwesomeIcon icon={faEye} />
                ) : (
                  <FontAwesomeIcon icon={faEyeSlash} />
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-indigo-700 rounded-md hover:bg-indigo-600 focus:outline-none active:bg-indigo-500 focus:bg-indigo-600"
            >
              Sign Up
            </button>
          </div>
        </form>

        <p className="mt-8 text-xs font-light text-center text-gray-700">
          Already have an account?
          <span
            onClick={() => {
              navigate("/signin");
              dispatch(unsetError());
            }}
            className="font-medium  text-indigo-600 hover:underline cursor-pointer"
          >
            Sign In
          </span>
        </p>
      </div>
    </>
  );
};

export default Signup;
