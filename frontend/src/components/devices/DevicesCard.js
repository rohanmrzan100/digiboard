import {
  faCirclePlay,
  faPhotoFilm,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { removeDevice } from "../../API/Device";
import { isloading } from "../../store/slice/utilsSlice";
import { useDispatch } from "react-redux";
import { setDevice } from "../../store/slice/deviceSlice";
import { getPlaylist } from "../../API/Playlist";
const DevicesCard = (props) => {
  const dispatch = useDispatch();

  const [playlist, setPlaylist] = useState();

  useEffect(() => {
    if (props.device.playlist) {
      getPlaylist(props.device.playlist).then((res) => {
        console.log(res);
        if (res.playlist) {
          setPlaylist(res.playlist);
        }
      });
    }
  }, []);
  const handleDelete = () => {
    dispatch(isloading({ type: "true" }));
    removeDevice(props.device._id).then((res) => {
      localStorage.removeItem("device");
      setInterval(() => {
        window.location.href = "/devices";
      }, 2000);
    });
  };



  const handlePlaylistClick = () => {
    localStorage.setItem("device", props.device._id);
    dispatch(setDevice(props.device._id));
    window.location.href = "/device/playlist/add";
  };
  const handleInteractiveClick = ()=>{
     localStorage.setItem("device", props.device._id);
      window.location.href = "/device/interactive";
  }

  const date = moment(props.device.createdAt).format("YYYY MM DD,  h:mm a");
  return (
    <div className="my-4 px-6 py-2  rounded-xl md:flex-row flex flex-col  bg-gray-300 justify-between items-center  ">
      <div className="">
        <h1 className=" text-xl">{props.device.name}</h1>
        <p className="text-md font-semibold text-gray-500">
          {props.device.uid}
        </p>

        <p className="text-xs text-gray-500">Added On : {date}</p>
        {props.device && (
          <p className="text-sm text-gray-00">Now Playing : {props.device.c_playlist}</p>
        )}
      </div>

      <div className="flex justify-between items-center space-x-6  ">

        <button
          onClick={handlePlaylistClick}
          className="flex flex-col items-center space-y-4 hover:text-orange-500 p-4 rounded-md hover:bg-gray-200"
        >
          <FontAwesomeIcon
            icon={faCirclePlay}
            className="scale-150 text-ornage-500"
          />
          <p className="text-lg">Add Playlist</p>
        </button>
        <button
          onClick={handleInteractiveClick}
          className="flex flex-col items-center space-y-4 hover:text-orange-500 p-4 rounded-md hover:bg-gray-200"
        >
          <FontAwesomeIcon
            icon={faPhotoFilm}
            className="scale-150 text-ornage-500"
          />
          <p className="text-lg">Play Interactive</p>
        </button>
    
        <button
          onClick={handleDelete}
          className="flex flex-col items-center space-y-4 hover:text-red-700 p-4 rounded-md hover:bg-gray-200"
        >
          <FontAwesomeIcon icon={faTrashCan} className="scale-150" />
          <p className="text-lg">Remove</p>
        </button>
      </div>
    </div>
  );
};

export default DevicesCard;
