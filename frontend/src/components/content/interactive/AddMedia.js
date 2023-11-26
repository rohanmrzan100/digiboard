import React, { useEffect, useState } from "react";
import { getUserData } from "../../../API/User";
import { errorToast, successToast } from "../../utils/Toast";
import { baseURL } from "../../../Constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faVideo } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { addArray, removeArray } from "../../../store/slice/arraySlice";
import { addMediaToInteractive } from "../../../API/Interactive";
import { isloading } from "../../../store/slice/utilsSlice";
const AddInteractiveMedia = () => {
  const [media, setMedia] = useState();
  const dispatch = useDispatch();
  const array = useSelector((state) => state.array);
  useEffect(() => {
    getUserData()
      .then((res) => {
        if (res.doc) {
          setMedia(res.doc.media_id);
        }
      })
      .catch((err) => {
        console.log(err);
        errorToast("Something went wrong");
      });
  }, []);
  const handleClick = () => {
    dispatch(isloading({ type: "true" }));
    addMediaToInteractive(array)
      .then((res) => {
        successToast("Media added to interactive successfully !");
        setTimeout(() => {
          window.location.href = "/create/interactive";
          dispatch(isloading({ type: "false" }));
        }, 2000);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
        errorToast("Something went wrong !");
        dispatch(isloading({ type: "true" }));
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
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Your Media</h1>
        <button
          onClick={handleClick}
          className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded active:scale-105 focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Add Interactive
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2  gap-x-4 gap-y-4  ">
        {media &&
          media.map((media) => {
            console.log(media.media);
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
      </div>
    </div>
  );
};

export default AddInteractiveMedia;
