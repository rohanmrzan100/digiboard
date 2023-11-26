import React, { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faVideo } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { errorToast, successToast } from "../../utils/Toast";
import { addArray, removeArray } from "../../../store/slice/arraySlice";
import { createPlaylist } from "../../../API/Playlist";
import { useNavigate } from "react-router-dom";
import Empty from "../../utils/Empty";
import { baseURL } from "../../../Constants";
const Media = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const array = useSelector((state) => state.array);
  const [userMedia, setUserMedia] = useState([]);

  useEffect(() => {
    setUserMedia(props.media);
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target[0].value;
    if (array.length < 1 || !name) {
      return errorToast("Please Provide name and at least one media.");
    }
    createPlaylist(name, array)
      .then((res) => {
        console.log(res);
        successToast("Playlist Created Successfully");
        navigate("/content");
      })
      .catch((error) => {
        console.log(error);

        if (error.response) {
          errorToast(error.response.data.msg);
        } else {
          errorToast("Creation of Playist Failed");
        }
      });
  };
  const handleChange = (event, media) => {
    const id = media._id;

    if (event.target.checked) {
      dispatch(addArray(id));
    } else {
      dispatch(removeArray({ id, array }));
    }
  };
  return (
    <div className="w-full mt-8 ">
      <form
        onSubmit={handleSubmit}
        className=" flex justify-between flex-col sm:flex-row items-center mb-8"
      >
        <div className="mb-2 w-5/12">
          <label className="block text-sm font-semibold text-gray-800">
            Enter Name of Playlist
          </label>
          <input
            name="mname"
            type="text"
            className="block w-full  px-4 py-2 mt-2 text-black bg-white border border-black rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
          />
        </div>
        <button
          className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded active:scale-105 focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Create Playlist
        </button>
      </form>

      <h1 className="text-2xl mb-8 font-semibold"> Media You have Uploaded</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2  gap-x-4 gap-y-4  ">
        {userMedia &&
          userMedia.map((media) => {
            if (media.type === "video") {
              return (
                <div
                  className="rounded  overflow-hidden shadow-lg"
                  key={media._id}
                >
                  <video
                    poster={media.thumbnail}
                    controls
                    className="w-full h-48 object-cover brightness-90 hover:brightness-100"
                  >
                    <source src={baseURL + media.media} type="video/mp4" />
                  </video>

                  <div className=" p-6 flex justify-between items-start">
                    <div className="flex  flex-start items-center">
                      <FontAwesomeIcon icon={faVideo} />
                      <div className="px-2">{media.name.substring(0, 15)}</div>
                    </div>

                    <input
                      onChange={(e) => handleChange(e, media)}
                      id="default-checkbox"
                      type="checkbox"
                      value=""
                      className="w-4 h-4 cursor-pointer text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    ></input>
                  </div>
                </div>
              );
            } else {
              return (
                <div
                  className="rounded overflow-hidden shadow-lg"
                  key={media._id}
                >
                  <img
                    className="w-full h-48 object-cover"
                    src={baseURL + media.media}
                    loading="lazy"
                    alt={""}
                  />

                  <div className="p-6 flex justify-between items-start">
                    <div className="flex items-center justify-start">
                      <FontAwesomeIcon icon={faImage} />
                      <div className="px-2">{media.name.substring(0, 15)}</div>
                    </div>

                    <input
                      onChange={(e) => handleChange(e, media)}
                      id="default-checkbox"
                      type="checkbox"
                      value=""
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    ></input>
                  </div>
                </div>
              );
            }
          })}

        {userMedia && !userMedia.length > 0 && (
          <Empty text="You have not uploaded any media" />
        )}
      </div>
    </div>
  );
};

export default Media;
