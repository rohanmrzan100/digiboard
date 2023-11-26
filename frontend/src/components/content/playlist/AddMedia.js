import React, { useEffect, useState } from "react";

import MediaCard from "./Media";
import GoBack from "../../utils/GoBack";
import { getNotAssignedMedia } from "../../../API/Playlist";
import { errorToast } from "../../utils/Toast";
import { useDispatch } from "react-redux";
import { isloading } from "../../../store/slice/utilsSlice";
const AddMedia = () => {
  const [userMedia, setUserMedia] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(isloading({ type: "true" }));
    getNotAssignedMedia(localStorage.getItem("playlist"))
      .then((res) => {
        dispatch(isloading({ type: "false" }));
        if (res.array) {
          setUserMedia(res.array);
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(isloading({ type: "false" }));
        errorToast("Something Went Wrong.");
      });
  }, []);

  return (
    <div className="w-full ">
      <GoBack goto={`/playlist/preview/${localStorage.getItem("playlist")}`} />
      <MediaCard media={userMedia} />
    </div>
  );
};

export default AddMedia;
