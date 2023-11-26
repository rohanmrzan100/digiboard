import React, { useEffect, useState } from "react";
import GoBack from "../../utils/GoBack";
import Empty from "../../utils/Empty";
import { errorToast, successToast } from "../../utils/Toast";
import {
  RemoveMediaFromInteractive,
  getInteractive,
} from "../../../API/Interactive";
import {
  Popover,
  PopoverContent,
  PopoverHandler,
  Tooltip,
} from "@material-tailwind/react";
import {
  faEllipsisVertical,
  faImage,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { baseURL } from "../../../Constants";
import { isloading } from "../../../store/slice/utilsSlice";
import { useDispatch } from "react-redux";

const InteractiveEdit = () => {
  const [media, setMedia] = useState();
  const [empty, setEmpty] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    getInteractive()
      .then((res) => {
        if (res.interactive.media) {
          setMedia(res.interactive.media);
          if (res.interactive.media.length > 0) {
            setEmpty(false);
          } else {
            setEmpty(true);
          }
        }
      })
      .catch((err) => {
        setEmpty(true);
        console.log(err);
        // errorToast("Something went wrong!");
      });
  }, []);

  const handleRemove = (id) => {
    dispatch(isloading({ type: "true" }));
    RemoveMediaFromInteractive(id)
      .then((res) => {
        successToast("Media Removed from interactive successfully !");
        setTimeout(() => {
          window.location.href = "/create/interactive";
          dispatch(isloading({ type: "false" }));
        }, 2000);
      })
      .catch((err) => {
        dispatch(isloading({ type: "false" }));
        errorToast("Something went wrong !");
        console.log(err);
      });
  };
  return (
    <div>
      <GoBack goto="/content" />
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Your Interactive Media</h1>
          <button
            onClick={() => {
              window.location.href = "/add/interactive";
            }}
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded active:scale-105 focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Add
          </button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-3  gap-x-4 gap-y-4 ">
          {empty && <Empty text="You have not added any media." />}
          {media &&
            media.map((media) => {
              if (media.type === "video") {
                return (
                  <div
                    className="rounded overflow-hidden flex flex-col justify-between shadow-lg"
                    key={media._id}
                  >
                    <video
                      poster={""}
                      controls
                      className="w-full h-44 object-cover brightness-90 hover:brightness-100"
                    >
                      <source src={baseURL + media.media} type="video/mp4" />
                    </video>

                    <div className="p-4 text-sm flex  justify-between items-start">
                      <div className="flex  flex-start items-center">
                        <FontAwesomeIcon icon={faVideo} />
                        <Tooltip content={media.name}>
                          <div className="px-2">
                            {media.name.substring(0, 10)}
                          </div>
                        </Tooltip>
                      </div>

                      <Popover placement="right">
                        <PopoverHandler>
                          <FontAwesomeIcon
                            icon={faEllipsisVertical}
                            className="scale-150 cursor-pointer hover:text-gray-700"
                          />
                        </PopoverHandler>
                        <PopoverContent className="bg-gray-200 border-2 border-black ">
                          <ul className="font-semibold space-y-2 text-md">
                            <li>
                              {" "}
                              <button
                                className="hover:bg-red-600 hover:text-white w-full h-10 border-black rounded-md text-red-600  border-2"
                                onClick={() => handleRemove(media._id)}
                              >
                                Remove
                              </button>
                            </li>

                            <li>
                              <a
                                href={baseURL + media.media}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <button className="hover:bg-green-600 border-2 h-10  border-black text-green-600 hover:text-white w-24 rounded-md">
                                  Preview
                                </button>
                              </a>
                            </li>
                          </ul>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div
                    className="rounded overflow-hidden flex flex-col justify-between shadow-lg"
                    key={media._id}
                  >
                    <img
                      alt=""
                      src={baseURL + media.media}
                      className="w-full h-44 object-cover brightness-90 hover:brightness-100"
                    />

                    <div className="p-4 text-sm flex justify-between items-start">
                      <div className="flex  flex-start items-center">
                        <FontAwesomeIcon icon={faImage} />
                        <Tooltip content={media.name}>
                          <div className="px-2">
                            {media.name.substring(0, 10)}
                          </div>
                        </Tooltip>
                      </div>

                      <Popover placement="right">
                        <PopoverHandler>
                          <FontAwesomeIcon
                            icon={faEllipsisVertical}
                            className="scale-150 cursor-pointer hover:text-gray-700"
                          />
                        </PopoverHandler>
                        <PopoverContent className="bg-gray-200 border-2 border-black ">
                          <ul className="font-semibold space-y-2 text-md">
                            <li>
                              {" "}
                              <button
                                className="hover:bg-red-600 hover:text-white w-full h-10 border-black rounded-md text-red-600  border-2"
                                onClick={() => {}}
                              >
                                Delete
                              </button>
                            </li>

                            <li>
                              <a
                                href={baseURL + media.media}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <button className="hover:bg-green-600 border-2 h-10  border-black text-green-600 hover:text-white w-24 rounded-md">
                                  Preview
                                </button>
                              </a>
                            </li>
                          </ul>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                );
              }
            })}
        </div>
      </div>
    </div>
  );
};

export default InteractiveEdit;
