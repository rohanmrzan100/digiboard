import { faImage, faPlay, faVideo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { baseURL } from "../../Constants";
import { Radio, Tooltip } from "@material-tailwind/react";
import { PlayInteractive, getInteractive } from "../../API/Interactive";
import Empty from "../utils/Empty";
import { errorToast, successToast } from "../utils/Toast";
import { useDispatch } from "react-redux";
import { isloading } from "../../store/slice/utilsSlice";
const Interactive = () => {
  const [media, setMedia] = useState();
  const [media_id, setMedia_id] = useState();
  const [empty, setEmpty] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    getInteractive()
      .then((res) => {
        if (res.interactive.media) {
          setMedia(res.interactive.media);
          if (res.interactive.media.length > 0) {
            setEmpty(false);
          } else {
            setEmpty(true);
          }
        }
      })
      .catch((err) => {
        console.log(err);
        errorToast("Something went wrong!");
      });
  }, []);
  const handleChange = (e) => {
    setMedia_id(e.target.value);
  };
  const handlePlay = () => {
    dispatch(isloading({ type: true }));
    PlayInteractive(media_id)
      .then((res) => {
        successToast("Media Playing in all devices !");
        setTimeout(() => {
          dispatch(isloading({ type: false }));
          window.location.href = "/content";
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
            {" "}
            Select One Media to Play on All Devices{" "}
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
        {empty && <Empty text="You have not added any media." />}
        <div className="grid  grid-cols-1 lg:grid-cols-6  md:grid-col-4 m-auto sm:grid-cols-3 xs:grid-col-2  gap-x-4 gap-y-4 ">
          {media &&
            media.map((media) => {
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
        </div>
      </div>
    </div>
  );
};

export default Interactive;
