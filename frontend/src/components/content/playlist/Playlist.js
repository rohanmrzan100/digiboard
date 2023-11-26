import React, { useEffect, useState } from "react";
import GoBack from "../../utils/GoBack";
import { getUserData } from "../../../API/User";
import Media from "./CreatePlaylist";
import { errorToast } from "../../utils/Toast";

const Playlist = () => {
  const [media, setMedia] = useState();

  useEffect(() => {
    getUserData()
      .then((res) => {
        if (res.doc) {
          setMedia(res.doc.media_id);
        }
      })
      .catch((error) => {
        console.log(error);
        errorToast("Error has occured");
      });
  }, []);
  return (
    <div>
      <GoBack goto="/content" />
      <Media media={media} />
    </div>
  );
};

export default Playlist;
