import React, { useEffect, useState } from "react";
import PlaylistAssign from "./PlaylistAssigned";
import AddPlaylist from "./AddPlaylist";
import { loadDeviceInfo } from "../../../API/Device";

const Main = () => {
  const [playlist, setPlaylist] = useState([]);
  useEffect(() => {
    const id = localStorage.getItem("device");
    loadDeviceInfo(id)
      .then((res) => {
        if (res.device) {
          setPlaylist(res.device.a_playlist);
        }
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div>
      <PlaylistAssign playlist={playlist} />
      <hr className="h-px my-16 border-0 bg-gray-700"></hr>
      <AddPlaylist />
    </div>
  );
};

export default Main;
