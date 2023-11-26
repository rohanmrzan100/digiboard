import React, { useEffect, useState } from "react";
import { deleteMedia, getUserData } from "../../API/User";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faImage,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { isloading } from "../../store/slice/utilsSlice";
import {
  Popover,
  PopoverContent,
  PopoverHandler,
  Tooltip,
} from "@material-tailwind/react";
import Empty from "../utils/Empty";
import PlaylistCard from "./playlist/PlaylistCard";
import { baseURL } from "../../Constants";
import Skeleton from "../utils/SkeletonLoading";

const Media = () => {
  const [loading, setLoading] = useState(true);
  const [userMedia, setUserMedia] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [mediaEmpty, setMediaEmpty] = useState(false);
  const [playlistEmpty, setPlaylistEmpty] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(isloading({ type: "true" }));
    getUserData()
      .then((res) => {
        setLoading(false);
        if (res.doc) {
          setUserMedia(res.doc.Media.reverse());
          setPlaylist(res.doc.playlist);
          if (res.doc.Playlist.length <= 0) {
            setPlaylistEmpty(true);
          }
          if (res.doc.Media.length <= 0) {
            setMediaEmpty(true);
          }
        }

        dispatch(isloading({ type: "false" }));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleDelete = (id) => {
    dispatch(isloading({ type: "true" }));
    deleteMedia(id)
      .then(() => {
        setInterval(() => {
          window.location.reload(true);
          dispatch(isloading({ type: "false" }));
        }, 2000);
      })
      .catch((err) => {
        dispatch(isloading({ type: "false" }));
        console.log(err);
      });
  };

  return (
    <div className="w-full mt-8 ">
      <div className="mb-8">
        <h1 className="text-2xl mb-8 font-semibold"> Your Playlist</h1>
        {loading && <Skeleton />}
        {playlistEmpty && <Empty text="You have not added any playlist." />}

        <div className="grid  grid-cols-1 lg:grid-cols-6 md:grid-col-5 m-auto sm:grid-cols-3 xs:grid-col-2  gap-x-4 gap-y-4 ">
          {playlist &&
            playlist.map((playlist) => (
              <PlaylistCard playlist={playlist} key={playlist.id} />
            ))}
        </div>
      </div>

      <h1 className="text-2xl mb-8 font-semibold"> Your Media</h1>
      {loading && <Skeleton />}
      <div className="grid  grid-cols-1 lg:grid-cols-4  md:grid-col-3 m-auto sm:grid-cols-2 xs:grid-col-2  gap-x-4 gap-y-4 ">
        {mediaEmpty && <Empty text="You have not added any media." />}
        {userMedia &&
          userMedia.map((media) => {
            if (media.type === "video") {
              return (
                <div
                  className="rounded overflow-hidden flex flex-col justify-between shadow-lg"
                  key={media.id}
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
                      
                            <button
                              className="hover:bg-red-600 hover:text-white w-full h-10 border-black rounded-md text-red-600  border-2"
                              onClick={() => handleDelete(media.id)}
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
                              onClick={() => handleDelete(media._id)}
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

        {/* {userMedia && !userMedia.length > 0 && (
          <Empty text="You have not added any Media." />
        )} */}
      </div>
    </div>
  );
};

export default Media;
