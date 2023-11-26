import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faTrash, faVideo } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { Tooltip } from "@material-tailwind/react";
import { deleteMediaFromPlaylist, getPlaylist } from "../../../API/Playlist";
import { errorToast, successToast } from "../../utils/Toast";
import { isloading } from "../../../store/slice/utilsSlice";
import GoBack from "../../utils/GoBack";
import Empty from "../../utils/Empty";
import { baseURL } from "../../../Constants";
const Preview = () => {
  const playlist_id = useSelector((state) => state.utils.playlist_id);
  const [playlist, setPlaylist] = useState();
  const [media, setMedia] = useState([]);

  const dispatch = useDispatch();
  const id = localStorage.getItem("playlist") || playlist_id;
  useEffect(() => {
    if (id) {
      getPlaylist(id)
        .then((res) => {
          console.log(res);
          if (res.playlist) {
            setPlaylist(res.playlist);
            setMedia(res.playlist.media);
          }
        })
        .catch((err) => {
          console.log(err);
          errorToast("Error Loading Playlist");
        });
    }
  }, []);

  const handleDelete = (mid) => {
    dispatch(isloading({ type: "true" }));
    const pid = localStorage.getItem("playlist");
    deleteMediaFromPlaylist(mid, pid)
      .then((res) => {
        dispatch(isloading({ type: "false" }));
        successToast("Media Removed from Playlist");
        window.location.reload(false);
        //reload page
      })
      .catch((err) => {
        dispatch(isloading({ type: "false" }));
        console.log(err);
        window.location.reload(false);
      });
  };
  const handleClick = () => {
    window.location.href = `/playlist/${localStorage.getItem("playlist")}/add`;
  };
  return (
    <div className="w-full ">
      <GoBack goto={"/content"} />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">{playlist && playlist.name}</h1>
        <button
          onClick={handleClick}
          className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded active:scale-105 focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Add More
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2  gap-x-4 gap-y-4 ">
        {media && !media.length > 0 && (
          <Empty text="No Media Added in this Playlist" />
        )}
        {media &&
          media.map((media) => {
            if (media.type === "video") {
              return (
                <div
                  className="rounded overflow-hidden shadow-lg"
                  key={media._id}
                >
                  <video
                    poster={""}
                    controls
                    className="w-full h-48 object-cover brightness-90 hover:brightness-100"
                  >
                    <source src={baseURL + media.media} type="video/mp4" />
                  </video>

                  <div className="p-6 flex justify-between items-start">
                    <div className="flex  flex-start items-center">
                      <FontAwesomeIcon icon={faVideo} />
                      <Tooltip content={media.name}>
                        <div className="px-2">
                          {media.name.substring(0, 15)}
                        </div>
                      </Tooltip>
                    </div>
                    <Tooltip content="Remove Media from Playlist">
                      <button
                        className="hover:text-red-700 hover:scale-110   text-red-600  "
                        onClick={() => handleDelete(media._id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </Tooltip>
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
                    <Tooltip content="Remove Media from Playlist">
                      <button
                        className="hover:text-red-700 hover:scale-110   text-red-600  "
                        onClick={() => handleDelete(media._id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              );
            }
          })}
      </div>
    </div>
  );
};

export default Preview;
