import React, { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faVideo } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { addArray, removeArray } from "../../../store/slice/arraySlice";
import { isloading } from "../../../store/slice/utilsSlice";
import { errorToast } from "../../utils/Toast";
import Empty from "../../utils/Empty";
import { addMediaToPlaylist } from "../../../API/Playlist";
import { baseURL } from "../../../Constants";
import { Tooltip } from "@material-tailwind/react";
const Media = (props) => {
  const dispatch = useDispatch();

  const array = useSelector((state) => state.array);
  const [userMedia, setUserMedia] = useState([]);

  useEffect(() => {
    // console.log(props.media);
    setUserMedia(props.media);
  },[]);

  const handleClick = () => {
    if (array.length <= 0) {
      return errorToast("Please Select Media before Adding");
    }
    const id = localStorage.getItem("playlist");

    console.log(array, id);
    dispatch(isloading({ type: "true" }));

    addMediaToPlaylist(id, array).then((res) => {
      window.location.href = `/playlist/preview/${id}`;
      dispatch(isloading({ type: "false" }));
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold"> Media Not in this Playlist</h1>
        <button
          onClick={handleClick}
          className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded active:scale-105 focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Add
        </button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-3  gap-x-4 gap-y-4 ">
        {!userMedia.length > 0 && (
          <Empty text="You have not uploaded any media." />
        )}
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
                      <Tooltip content={media.name}>
                        <div className="px-2">
                          {media.name.substring(0, 15)}
                        </div>
                      </Tooltip>
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
                      <Tooltip content={media.name}>
                        <div className="px-2">
                          {media.name.substring(0, 15)}
                        </div>
                      </Tooltip>
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
      </div>
    </div>
  );
};

export default Media;
