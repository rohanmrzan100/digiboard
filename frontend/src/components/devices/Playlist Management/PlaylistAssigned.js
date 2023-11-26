import React, { useEffect, useState } from "react";
import Empty from "../../utils/Empty";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlay,
  faClose,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { Radio, Tooltip } from "@material-tailwind/react";
import {
  getDeviceByID,
  playPlaylist,
  removePlaylistFromDevice,
} from "../../../API/Device";
import { useNavigate } from "react-router-dom";
import { errorToast, successToast } from "../../utils/Toast";
import { isloading } from "../../../store/slice/utilsSlice";
import { useDispatch } from "react-redux";

const PlaylistAssign = (props) => {
  const playlist = props.playlist;
  const [now, setNow] = useState(false);
  const [pid, setPid] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const did = localStorage.getItem("device");
  useEffect(() => {
    getDeviceByID(did)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  }, []);
  const handleClick = (pid) => {
    console.log(did, pid);
    dispatch(isloading({ type: "true" }));
    playPlaylist(did, pid)
      .then(async (res) => {
        successToast("Playlist Playing in device Successfully");
        navigate("/devices");

        dispatch(isloading({ type: "false" }));
      })
      .catch((err) => {
        dispatch(isloading({ type: "false" }));
        console.log(err);
        errorToast("Playing playlist in device  unsuccessful");
      });
  };

  const handleChange = (e) => {
    console.log(e.target.value);
    setPid(e.target.value);
  };

  const handleDelete = (pid) => {
    dispatch(isloading({ type: "true" }));
    removePlaylistFromDevice(did, pid)
      .then((res) => {
        successToast("Playlist Removed Successfully");
        window.location.reload(false);
        dispatch(isloading({ type: "false" }));
      })
      .catch((err) => {
        dispatch(isloading({ type: "false" }));
        console.log(err);
        errorToast("Removing playlist from device unsuccessful");
      });
  };
  const image =
    "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=";
  return (
    <div>
      {props.device && (
        <p className="text-sm text-gray-00">
          Now Playing : {props.device.c_playlist}
        </p>
      )}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">
          Playlist Assigned To This Device
        </h1>
        <button
          onClick={() => handleClick(pid)}
          className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded active:scale-105 focus:outline-none focus:shadow-outline"
          type="submit"
        >
          <FontAwesomeIcon icon={faPlay} className="mx-2" />
          Play
        </button>
      </div>
      {playlist && playlist.length <= 0 && (
        <Empty text="You have not added any playlist." />
      )}

      <form className="grid grid-cols-1 lg:grid-cols-6  md:grid-col-4 m-auto sm:grid-cols-3 xs:grid-col-2  gap-x-4 gap-y-4 ">
        {playlist &&
          playlist.map((playlist) => (
            <div
              className="rounded overflow-hidden relative shadow-lg"
              key={playlist._id}
              onChange={handleChange}
            >
              {now && <h1>Now Playing</h1>}

              <Tooltip content="Remove Playlist from Device">
                <button
                  className="hover:text-red-700 hover:scale-110 absolute top-0 right-0 p-2  text-red-600  "
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(playlist._id);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faClose}
                    className="p-.5 border-2 border-red-600"
                  />
                </button>
              </Tooltip>
              <img
                className="w-full h-24 object-cover"
                src={image}
                loading="lazy"
                alt={""}
              />
              <div className="px-4 flex justify-between items-center">
                <div className="flex items-center justify-start text-sm">
                  <FontAwesomeIcon icon={faCirclePlay} />
                  <Tooltip content={playlist.name}>
                    <div className="px-2">{playlist.name.substring(0, 15)}</div>
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
      </form>
    </div>
  );
};

export default PlaylistAssign;
