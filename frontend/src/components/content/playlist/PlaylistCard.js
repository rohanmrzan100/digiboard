import {
  faCirclePlay,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Popover,
  PopoverContent,
  PopoverHandler,
  Tooltip,
} from "@material-tailwind/react";
import { useDispatch } from "react-redux";
import { isloading, setPlaylist_id } from "../../../store/slice/utilsSlice";
import { errorToast, successToast } from "../../utils/Toast";
import { deletePlaylist } from "../../../API/Playlist";
import { useNavigate } from "react-router-dom";

export default function PlaylistCard(props) {
  const navigate = useNavigate();
  const playlist = props.playlist;
  const dispatch = useDispatch();
  const handleDelete = (id) => {
    dispatch(isloading({ type: "true" }));

    deletePlaylist(id)
      .then((res) => {
        dispatch(isloading({ type: "false" }));
        successToast("Playlist deleted sucessfully");
        window.location.reload(false);
        console.log(res);
      })
      .catch((err) => {
        if (err.response.data) {
          errorToast(err.response.data.msg);
        } else {
          errorToast("Deletion Failed.");
        }
        dispatch(isloading({ type: "false" }));
        console.log(err);
      });
  };
  const image =
    "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=";
  return (
    <div className="rounded overflow-hidden shadow-lg" key={playlist._id}>
      <img
        onClick={() => {
          localStorage.setItem("playlist", playlist._id);
          navigate(`/playlist/preview/${playlist._id}`);
          dispatch(setPlaylist_id(playlist._id));
        }}
        className="w-full h-32 object-cover"
        src={image}
        loading="lazy"
        alt={""}
      />

      <div className="p-4 flex justify-between items-start">
        <div className="flex items-center justify-start text-sm">
          <FontAwesomeIcon icon={faCirclePlay} />
          <Tooltip content={playlist.name}>
            <div className="px-2">{playlist.name.substring(0, 15)}</div>
          </Tooltip>
    
        </div>

        <Popover placement="right">
          <PopoverHandler>
            <FontAwesomeIcon
              icon={faEllipsisVertical}
              className="scale-150 cursor-pointer hover:text-gray-700"
            />
          </PopoverHandler>
          <PopoverContent className="bg-gray-200 border-2 border-black ">
            <ul className="font-semibold space-y-2 text-md">
              <li>
                {" "}
                <button
                  className="hover:bg-red-600 hover:text-white w-full h-10 border-black rounded-md text-red-600  border-2"
                  onClick={() => handleDelete(playlist._id)}
                >
                  Delete
                </button>
              </li>

              <li>
                <button
                  onClick={() => {
                    localStorage.setItem("playlist", playlist._id);
                    navigate(`/playlist/preview/${playlist._id}`);
                    dispatch(setPlaylist_id(playlist._id));
                  }}
                  className="hover:bg-green-600 border-2 h-10  border-black text-green-600 hover:text-white w-24 rounded-md"
                >
                  Preview
                </button>
              </li>
            </ul>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
