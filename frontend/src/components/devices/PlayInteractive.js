import { faImage, faPlay, faVideo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { getUserData } from "../../API/User";
import Empty from "../utils/Empty";
import { Radio, Tooltip } from "@material-tailwind/react";
import { addInteractive } from "../../API/Device";
import { errorToast, successToast } from "../utils/Toast";
import { isloading } from "../../store/slice/utilsSlice";
import { useDispatch } from "react-redux";
import { baseURL } from "../../Constants";
const PlayInteractive = () => {
  const dispatch = useDispatch();
  const [userMedia, setUserMedia] = useState([]);
  const [media, setMedia] = useState();

  useEffect(() => {
    getUserData().then((res) => {
      if (res.doc) {
        setUserMedia(res.doc.media_id.reverse());
      }
    });
  }, []);
  const handleChange = (e) => {
    setMedia(e.target.value);
  };

  const handlePlay = () => {
    const did = localStorage.getItem("device");
    const mid = media;

    dispatch(isloading({ type: "true" }));
    addInteractive(did, mid)
      .then((res) => {
        dispatch(isloading({ type: "false" }));
        successToast("Interactive Playing");
        setInterval(() => (window.location.href = "/devices"), 2000);
      })
      .catch((err) => {
        dispatch(isloading({ type: "false" }));
        console.log(err);
        if (err.response) {
          errorToast(err.response.data.msg);
        } else {
          errorToast("Error adding interactive play.");
        }
      });
  };
  return (
    <div>
      <div className="w-full mt-8 ">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl mb-8 font-semibold"> Select One Media </h1>

          <button
            onClick={handlePlay}
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded active:scale-105 focus:outline-none focus:shadow-outline"
            type="submit"
          >
            <FontAwesomeIcon icon={faPlay} className="mx-2" />
            Play
          </button>
        </div>

        <div className="grid  grid-cols-1 lg:grid-cols-6  md:grid-col-4 m-auto sm:grid-cols-3 xs:grid-col-2  gap-x-4 gap-y-4 ">
          {userMedia &&
            userMedia.map((media) => {
              if (media.type === "video") {
                return (
                  <div
                    onChange={(e) => handleChange(e)}
                    className="rounded overflow-hidden flex flex-col justify-between shadow-lg"
                    key={media._id}
                  >
                    <video
                      poster={""}
                      controls
                      className="w-full h-32 object-cover brightness-90 hover:brightness-100"
                    >
                      <source src={baseURL + media.media} type="video/mp4" />
                    </video>

                    <div className="px-4 flex justify-between items-center">
                      <div className="flex  flex-start items-center">
                        <FontAwesomeIcon icon={faVideo} />
                        <Tooltip content={media.name}>
                          <div className="px-2">
                            {media.name.substring(0, 15)}
                          </div>
                        </Tooltip>
                      </div>
                      <Radio
                        id="blue"
                        name="color"
                        value={media._id}
                        color="blue"
                      />
                    </div>
                  </div>
                );
              } else {
                return (
                  <div
                    onChange={(e) => handleChange(e)}
                    className="rounded overflow-hidden flex flex-col justify-between shadow-lg"
                    key={media._id}
                  >
                    <img
                      alt=""
                      src={baseURL + media.media}
                      className="w-full h-32 object-cover brightness-90 hover:brightness-100"
                    />

                    <div className="px-4 flex justify-between items-center">
                      <div className="flex  flex-start items-center">
                        <FontAwesomeIcon icon={faImage} />
                        <Tooltip content={media.name}>
                          <div className="px-2">
                            {media.name.substring(0, 15)}
                          </div>
                        </Tooltip>
                      </div>
                      <Radio
                        id="blue"
                        name="color"
                        value={media._id}
                        color="blue"
                      />
                    </div>
                  </div>
                );
              }
            })}

          {userMedia && !userMedia.length > 0 && (
            <Empty text="You have not added any Media." />
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayInteractive;
