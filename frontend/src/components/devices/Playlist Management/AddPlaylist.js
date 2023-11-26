import React, { useEffect, useState } from "react";
import Empty from "../../utils/Empty";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import { Radio, Tooltip } from "@material-tailwind/react";
import { useDispatch } from "react-redux";
import { addPlaylistToDevice } from "../../../API/Device";
import { errorToast, successToast } from "../../utils/Toast";
import { isloading } from "../../../store/slice/utilsSlice";
import { getNotAssignedPlaylist } from "../../../API/Playlist";

const AddPlaylist = () => {
  const [playlist, setPlaylist] = useState([]);
  const [pid, setPid] = useState();
  const dispatch = useDispatch();
  const did = localStorage.getItem("device");
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  useEffect(() => {
    getNotAssignedPlaylist(did)
      .then((res) => {
        if (res.notassigned) {
          console.log(res.notassigned);
          setPlaylist(res.notassigned);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const handleClick = (pid) => {
    dispatch(isloading({ type: "true" }));
    addPlaylistToDevice(did, pid)
      .then(async (res) => {
        successToast("Playlist added Successfully");

        setTimeout(() => {
          window.location.reload(false);

          dispatch(isloading({ type: "false" }));
        }, 10000);
      })
      .catch((err) => {
        dispatch(isloading({ type: "false" }));
        console.log(err);
        if (err.response.data) {
          errorToast(err.response.data.msg);
        } else {
          errorToast("Adding playlist to device unsuccessful");
        }
      });
  };

  const handleChange = (e) => {
    setPid(e.target.value);
  };

  const image =
    "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=";
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">
          Playlist Not Assigned To This Device
        </h1>
        <button
          onClick={() => handleClick(pid)}
          className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded active:scale-105 focus:outline-none focus:shadow-outline"
          type="submit"
        >
          <FontAwesomeIcon icon={faCheck} className="mx-2" />
          Select
        </button>
      </div>
      {playlist && playlist.length <= 0 && <Empty text="No Playlist to add." />}

      <div className="grid grid-cols-1 lg:grid-cols-6  md:grid-col-4 m-auto sm:grid-cols-3 xs:grid-col-2  gap-x-4 gap-y-4 ">
        {playlist &&
          playlist.map((playlist) => (
            <div
              className="rounded overflow-hidden shadow-lg"
              key={playlist._id}
              onChange={handleChange}
            >
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
      </div>
    </div>
  );
};

export default AddPlaylist;
