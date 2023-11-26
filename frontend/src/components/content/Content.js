import React, { useState } from "react";
import AddImage from "./AddMedia";
import Media from "./Media";
import { Collapse, Button, Card, CardBody } from "@material-tailwind/react";
import { CloudArrowUpIcon, PlayPauseIcon } from "@heroicons/react/24/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhotoFilm } from "@fortawesome/free-solid-svg-icons";

const Content = () => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen((cur) => !cur);
  return (
    <div>
      <div className="flex items-center gap-4">
        <Button
          variant="gradient"
          className="flex items-center gap-3"
          onClick={toggleOpen}
        >
          <CloudArrowUpIcon strokeWidth={2} className="h-5 w-5" /> Upload Files
        </Button>
        <Button
          variant="outlined"
          onClick={() => (window.location.href = "/create/playlist")}
          className="flex items-center gap-3"
        >
          <PlayPauseIcon strokeWidth={2} className="h-5 w-5" />
          Create Playlist
        </Button>
        <Button
          variant="outlined"
          onClick={() => (window.location.href = "/create/interactive")}
          className="flex items-center gap-3"
        >
          <FontAwesomeIcon icon={faPhotoFilm} />
          interactive Media
        </Button>
      </div>
      <Collapse open={open}>
        <Card className="">
          <CardBody>
            <AddImage />
          </CardBody>
        </Card>
      </Collapse>
      <hr className="h-px my-4 border-0 bg-gray-700"></hr>

      <Media />
    </div>
  );
};

export default Content;
