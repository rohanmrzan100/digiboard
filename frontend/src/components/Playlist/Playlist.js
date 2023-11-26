import React, { useEffect, useState } from "react";
import Skeleton from "../utils/SkeletonLoading";
import Empty from "../utils/Empty";
import { useDispatch, useSelector } from "react-redux";
import { isloading } from "../../store/slice/utilsSlice";
import { getUserData } from "../../API/User";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay, faPlay } from "@fortawesome/free-solid-svg-icons";
import { Radio, Tooltip } from "@material-tailwind/react";
import { addPlaylistToAllDevices } from "../../API/Device";
import { errorToast, successToast } from "../utils/Toast";
const PlaylistPage = () => {
  const [playlist, setPlaylist] = useState([]);
  const [playlistId, setPlaylistId] = useState();
  const [playlistEmpty, setPlaylistEmpty] = useState(false);
  const loading = useSelector((state) => state.utils.isloading);
  const dispatch = useDispatch();
  const image =
    "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=";

  useEffect(() => {
    dispatch(isloading({ type: "true" }));
    getUserData()
      .then((res) => {
        if (res.doc) {
          setPlaylist(res.doc.playlist);
          if (res.doc.playlist.length <= 0) {
            setPlaylistEmpty(true);
          }
        }

        dispatch(isloading({ type: "false" }));
      })
      .catch((err) => {
        dispatch(isloading({ type: "false" }));
        console.log(err);
      });
  }, []);
  const handleChange = (e) => {
    setPlaylistId(e.target.value);
  };
  const handlePlay = () => {
    dispatch(isloading({ type: "true" }));
    addPlaylistToAllDevices(playlistId)
      .then((res) => {
        successToast("Playlist Playing in all devices !");
        setTimeout(() => {
          dispatch(isloading({ type: "false" }));
          window.location.href = "/devices";
        }, 2000);
      })
      .catch((err) => {
        dispatch(isloading({ type: false }));
        console.log(err);
        errorToast("Something went Wrong !");
      });
  };
  return (
    <div>
      <div className="w-full mt-8 ">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">
            Select One Playlist to Play on All Devices
          </h1>

          <button
            onClick={handlePlay}
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded active:scale-105 focus:outline-none focus:shadow-outline"
            type="submit"
          >
            <FontAwesomeIcon icon={faPlay} className="mx-2" />
            Play
          </button>
        </div>

        {loading && <Skeleton />}
        {playlistEmpty && <Empty text="You have not added any playlist." />}

        <div className="grid  grid-cols-1 lg:grid-cols-6 md:grid-col-5 m-auto sm:grid-cols-3 xs:grid-col-2  gap-x-4 gap-y-4 ">
          {!loading && playlist &&
            playlist.map((playlist) => (
              <div
                onChange={(e) => handleChange(e)}
                className="rounded overflow-hidden shadow-lg"
                key={playlist._id}
              >
                <img
                  className="w-full h-32 object-cover"
                  src={image}
                  loading="lazy"
                  alt={""}
                />

                <div className=" flex justify-between items-center px-2">
                  <div className="flex items-center justify-start text-sm">
                    <FontAwesomeIcon icon={faCirclePlay} />
                    <Tooltip content={playlist.name}>
                      <div className="px-2">
                        {playlist.name.substring(0, 15)}
                      </div>
                    </Tooltip>
                  </div>
                  <Radio
                    id="blue"
                    name="color"
                    value={playlist._id}
                    color="blue"
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PlaylistPage;
